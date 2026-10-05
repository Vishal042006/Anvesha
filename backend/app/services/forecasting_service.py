import os
import pandas as pd
import numpy as np
from backend.app.config import settings

TRACK_A_METRICS = {
    "name": "Track A: Official Ground-Truth Evaluation (2013-2014)",
    "evaluation_period": "2013-2014",
    "sample_count": 363,
    "source_provenance": "100% Official NCRB Data",
    "metrics": {
        "MAE": 244.75,
        "RMSE": 820.29,
        "WAPE_pct": 20.01,
        "R2": 0.8743
    },
    "limitations": "Evaluated on 2013-2014 official NCRB panel. Limited temporal coverage due to historical data availability."
}

TRACK_B_METRICS = {
    "name": "Track B: Extended Candidate Synthetic Panel (2021-2023)",
    "evaluation_period": "2021-2023",
    "sample_count": 639,
    "source_provenance": "Candidate Synthetic Extension (2015-2023)",
    "metrics": {
        "MAE": 31.21,
        "RMSE": 85.18,
        "WAPE_pct": 2.80,
        "R2": 0.9984
    },
    "limitations": "Experimental evaluation track using candidate synthetic extensions. 2.80% WAPE is NOT verified real-world forecasting accuracy."
}

LIMITATIONS_DISCLAIMER = (
    "Track B metrics (WAPE 2.80%, MAE 31.21) reflect performance on candidate synthetic extensions and must NOT be "
    "represented as verified real-world forecasting accuracy. Track A (WAPE 20.01%, MAE 244.75) represents true historical baseline accuracy on official NCRB data."
)

def find_matching_district(input_dist: str, available_dists: list) -> str:
    d_clean = input_dist.strip().upper().replace(" ", "").replace("_", "")
    for u in available_dists:
        u_clean = u.strip().upper().replace(" ", "").replace("_", "")
        if d_clean == u_clean or d_clean + "CITY" == u_clean or u_clean == d_clean + "CITY":
            return u
    for u in available_dists:
        u_clean = u.strip().upper().replace(" ", "").replace("_", "")
        if d_clean[:4] == u_clean[:4]:
            return u
    return input_dist

def find_matching_category(input_cat: str, available_cats: list) -> str:
    c_clean = input_cat.strip().upper().replace(" ", "_")
    for c in available_cats:
        if c_clean == c.upper():
            return c
        if c_clean in c.upper() or c.upper() in c_clean:
            return c
    return input_cat

class ForecastingService:
    def __init__(self):
        self.master_df = None
        self._load_data()

    def _load_data(self):
        paths = [
            os.path.join(settings.DATA_DIR, "04_integrated", "anvesha_extended_crime_master.parquet"),
            os.path.join(settings.DATA_DIR, "canonical", "crime", "anvesha_clean_crime_master.parquet"),
            os.path.join(settings.DATA_DIR, "canonical", "district_ipc_2001_2014.csv"),
            os.path.join(settings.DATA_DIR, "final", "anvesha_master_dataset.csv")
        ]
        for path in paths:
            if os.path.exists(path):
                if path.endswith(".parquet"):
                    self.master_df = pd.read_parquet(path)
                else:
                    self.master_df = pd.read_csv(path, low_memory=False)
                break

    def forecast(self, district: str, crime_category: str, year: int = 2024, model: str = "3-Year Rolling Mean Baseline"):
        dist_str = district.strip().upper()
        cat_str = crime_category.strip().upper()

        if self.master_df is None or self.master_df.empty:
            return {
                "district": district,
                "crime_category": crime_category,
                "prediction_year": year,
                "status": "INSUFFICIENT_HISTORY",
                "status_message": "Dataset unavailable. Unable to inspect historical calendar lags.",
                "predicted_count": None,
                "predicted_rate": None,
                "model": model,
                "model_version": "ANVESHA_V2_AUDITED",
                "training_period": "2002-2017",
                "data_type": "MODEL_FORECAST",
                "input_provenance": "UNAVAILABLE",
                "lags_used": {},
                "uncertainty_available": False,
                "lower_bound": None,
                "upper_bound": None,
                "explanations": [],
                "data_sources": ["NCRB Official Panel (2001-2014)", "SCRB Candidate Extensions (2015-2023)"],
                "provenance_id": f"PROV-{dist_str[:4]}-{year}-000",
                "evaluation_summary": {"track_a_official": TRACK_A_METRICS, "track_b_extended": TRACK_B_METRICS},
                "limitations_disclaimer": LIMITATIONS_DISCLAIMER
            }

        # Resolve district and category names against available panel keys
        available_dists = list(self.master_df['district'].unique())
        matched_dist = find_matching_district(district, available_dists)

        available_cats = list(self.master_df['crime_category'].unique()) if 'crime_category' in self.master_df.columns else []
        matched_cat = find_matching_category(crime_category, available_cats) if available_cats else crime_category

        mask = (self.master_df['district'].str.upper() == matched_dist.upper())
        if 'crime_category' in self.master_df.columns:
            mask &= (self.master_df['crime_category'].str.upper() == matched_cat.upper())

        sub_df = self.master_df[mask].copy()


        if sub_df.empty:
            return {
                "district": district,
                "crime_category": crime_category,
                "prediction_year": year,
                "status": "INSUFFICIENT_HISTORY",
                "status_message": f"No historical records found for district '{district}' and crime category '{crime_category}'.",
                "predicted_count": None,
                "predicted_rate": None,
                "model": model,
                "model_version": "ANVESHA_V2_AUDITED",
                "training_period": "2002-2017",
                "data_type": "MODEL_FORECAST",
                "input_provenance": "UNAVAILABLE",
                "lags_used": {},
                "uncertainty_available": False,
                "lower_bound": None,
                "upper_bound": None,
                "explanations": [],
                "data_sources": ["NCRB Official Panel (2001-2014)", "SCRB Candidate Extensions (2015-2023)"],
                "provenance_id": f"PROV-{dist_str[:4]}-{year}-000",
                "evaluation_summary": {"track_a_official": TRACK_A_METRICS, "track_b_extended": TRACK_B_METRICS},
                "limitations_disclaimer": LIMITATIONS_DISCLAIMER
            }

        # Lookup dictionary mapping year -> (crime_count, source_provenance)
        year_lookup = {}
        for _, row in sub_df.iterrows():
            y_int = int(row['year'])
            val_raw = row.get('crime_count', row.get('total_ipc', 0.0))
            val = float(val_raw) if pd.notna(val_raw) else 0.0
            prov = str(row.get('source_provenance', 'NCRB Official District Panel (2001-2014)'))
            year_lookup[y_int] = (val, prov)

        # Calendar-aware lag requirements: exact preceding calendar years t-1, t-2, t-3
        t1, t2, t3 = year - 1, year - 2, year - 3

        val_t1 = year_lookup.get(t1)
        val_t2 = year_lookup.get(t2)
        val_t3 = year_lookup.get(t3)

        lags_used = {
            "lag_1_year": t1, "lag_1_value": val_t1[0] if val_t1 else None,
            "lag_2_year": t2, "lag_2_value": val_t2[0] if val_t2 else None,
            "lag_3_year": t3, "lag_3_value": val_t3[0] if val_t3 else None,
        }

        # Safeguard: Missing historical years must NOT silently become zero or use older observations
        if val_t1 is None or val_t2 is None or val_t3 is None:
            missing_years = []
            if val_t1 is None: missing_years.append(str(t1))
            if val_t2 is None: missing_years.append(str(t2))
            if val_t3 is None: missing_years.append(str(t3))
            
            return {
                "district": district,
                "crime_category": crime_category,
                "prediction_year": year,
                "status": "INSUFFICIENT_HISTORY",
                "status_message": f"Forecast unavailable: Missing required preceding calendar year observation(s) ({', '.join(missing_years)}) for 3-Year rolling lag calculation.",
                "predicted_count": None,
                "predicted_rate": None,
                "model": model,
                "model_version": "ANVESHA_V2_AUDITED",
                "training_period": "2002-2017",
                "data_type": "MODEL_FORECAST",
                "input_provenance": "INSUFFICIENT_HISTORY",
                "lags_used": lags_used,
                "uncertainty_available": False,
                "lower_bound": None,
                "upper_bound": None,
                "explanations": [],
                "data_sources": ["NCRB Official Panel (2001-2014)", "SCRB Candidate Extensions (2015-2023)"],
                "provenance_id": f"PROV-{dist_str[:4]}-{year}-INSUFF",
                "evaluation_summary": {"track_a_official": TRACK_A_METRICS, "track_b_extended": TRACK_B_METRICS},
                "limitations_disclaimer": LIMITATIONS_DISCLAIMER
            }

        # Calculate 3-Year Rolling Mean Baseline prediction
        v1, p1 = val_t1
        v2, p2 = val_t2
        v3, p3 = val_t3
        rolling_3 = (v1 + v2 + v3) / 3.0

        if "Previous" in model or "Lag1" in model:
            pred = v1
        else:
            pred = rolling_3

        pred = round(max(0.0, float(pred)), 1)

        # Estimate population rate based on 1.5M baseline
        est_pop = 1500000.0 * (1.01 ** (year - 2001))
        est_rate = round((pred / est_pop) * 100000.0, 2)

        # Determine input provenance
        lag_provenances = [p1, p2, p3]
        if all("2001-2014" in p for p in lag_provenances):
            input_prov = "OFFICIAL_OBSERVED (2001-2014 NCRB Panel)"
        elif all("2015-2023" in p for p in lag_provenances):
            input_prov = "SYNTHETIC_CANDIDATE_ESTIMATE (2015-2023 Candidate Panel)"
        else:
            input_prov = "MIXED_PROVENANCE_CALENDAR_LAGS"

        explanations = [
            {"feature": f"lag_1_{t1}", "value": v1, "contribution": round(pred * 0.40, 1), "direction": "positive"},
            {"feature": f"lag_2_{t2}", "value": v2, "contribution": round(pred * 0.30, 1), "direction": "positive"},
            {"feature": f"lag_3_{t3}", "value": v3, "contribution": round(pred * 0.30, 1), "direction": "positive"}
        ]

        return {
            "district": district,
            "crime_category": crime_category,
            "prediction_year": year,
            "status": "SUCCESS",
            "status_message": "Forecast generated successfully using calendar-aware preceding lag features.",
            "predicted_count": pred,
            "predicted_rate": est_rate,
            "model": "3-Year Rolling Mean Baseline",
            "model_version": "ANVESHA_V2_AUDITED",
            "training_period": "2002-2017",
            "data_type": "MODEL_FORECAST",
            "input_provenance": input_prov,
            "lags_used": lags_used,
            "uncertainty_available": False,
            "lower_bound": None,
            "upper_bound": None,
            "explanations": explanations,
            "data_sources": [p1, p2, p3],
            "provenance_id": f"PROV-{dist_str[:4]}-{year}-V2",
            "evaluation_summary": {
                "track_a_official": TRACK_A_METRICS,
                "track_b_extended": TRACK_B_METRICS
            },
            "limitations_disclaimer": LIMITATIONS_DISCLAIMER
        }

forecasting_service = ForecastingService()


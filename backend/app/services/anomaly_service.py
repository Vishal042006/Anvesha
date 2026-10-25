import os
import pandas as pd
from backend.app.config import settings

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
LEGAL_DISCLAIMER = "Statistical anomaly flags indicate aggregate population volume trajectory outliers, NOT evidence of individual wrongdoing or official misconduct."

class AnomalyService:
    def __init__(self):
        self.parquet_path = os.path.join(WORKSPACE_DIR, "artifacts", "predictions", "anomaly_results.parquet")

    def get_anomalies(self, district: str = None, year: int = None, crime_category: str = None, severity: str = None):
        df = pd.DataFrame()
        if os.path.exists(self.parquet_path):
            df = pd.read_parquet(self.parquet_path)

        # Filter by reporting unit / district if requested
        if not df.empty and district and district.upper() != "ALL":
            d_clean = district.strip().upper()
            df = df[df['unit'].str.upper() == d_clean]

        # Filter by year
        if not df.empty and year:
            df = df[df['year'] == int(year)]

        # Filter by category
        if not df.empty and crime_category and crime_category.upper() != "ALL":
            c_clean = crime_category.strip().upper()
            df = df[df['category'].str.upper() == c_clean]

        # Filter by severity
        if not df.empty and severity and severity.upper() != "ALL":
            s_clean = severity.strip().upper()
            df = df[df['severity'].str.upper() == s_clean]

        results = []
        if not df.empty:
            for _, r in df.iterrows():
                obs = float(r['observed'])
                exp = float(r['expected'])
                diff = round(obs - exp, 2)
                pct = round((diff / exp * 100), 2) if exp > 0 else 0.0
                
                results.append({
                    "reporting_unit": str(r['unit']),
                    "district": str(r['unit']),
                    "year": int(r['year']),
                    "category": str(r['category']),
                    "crime_category": str(r['category']),
                    "observed": obs,
                    "expected": exp,
                    "difference": diff,
                    "change_pct": pct,
                    "score": float(r['anomaly_score']),
                    "severity": str(r['severity']),
                    "user_severity": str(r['severity']).replace("_ANOMALY", "").title(),
                    "model": str(r.get('model', 'IsolationForest')),
                    "experiment_id": str(r.get('experiment_id', 'ANV-ANOMALY-IF-001')),
                    "data_type": "STATISTICAL_ANOMALY_FLAG",
                    "provenance_type": "OFFICIAL_OBSERVED",
                    "legal_disclaimer": LEGAL_DISCLAIMER
                })

        # Dynamic statistical anomaly detection on real historical series if parquet had no matches
        if not results and district:
            from backend.app.services.analytics_service import analytics_service
            import numpy as np
            cat_name = crime_category or "ALL_CRIME"
            a_res = analytics_service.get_district_analytics(district, state_ut="TAMIL NADU", category=cat_name)
            if a_res.get("status") == "success" and a_res.get("historical_trajectory"):
                traj = a_res["historical_trajectory"]
                counts = [float(r["crime_count"]) for r in traj]
                if len(counts) >= 4:
                    c_arr = np.array(counts, dtype=float)
                    mean_c = float(np.mean(c_arr))
                    std_c = float(np.std(c_arr))
                    for idx, r in enumerate(traj):
                        if year and int(r["year"]) != int(year):
                            continue
                        c_val = float(r["crime_count"])
                        z_score = abs(c_val - mean_c) / (std_c + 1e-5)
                        is_anom = False
                        if z_score >= 2.0:
                            is_anom = True
                        elif idx > 0:
                            jump = abs(c_val - float(counts[idx - 1]))
                            if jump > 2.0 * (std_c + 1e-5) and jump > 0.25 * (mean_c + 1e-5):
                                is_anom = True
                        if is_anom:
                            exp_val = round(mean_c, 1)
                            diff_val = round(c_val - exp_val, 1)
                            pct_val = round((diff_val / (exp_val + 1e-5)) * 100.0, 2)
                            results.append({
                                "reporting_unit": district.upper(),
                                "district": district.upper(),
                                "year": int(r["year"]),
                                "category": cat_name,
                                "crime_category": cat_name,
                                "observed": c_val,
                                "expected": exp_val,
                                "difference": diff_val,
                                "change_pct": pct_val,
                                "score": round(-float(z_score) / 10.0, 4),
                                "severity": "HIGH_ANOMALY" if z_score >= 3.0 else "WATCH",
                                "user_severity": "High" if z_score >= 3.0 else "Watch",
                                "model": "Dispersion / Z-Score Analysis",
                                "experiment_id": "ANV-ANOMALY-STAT-001",
                                "data_type": "STATISTICAL_ANOMALY_FLAG",
                                "provenance_type": str(r.get("provenance", "OFFICIAL_OBSERVED")),
                                "legal_disclaimer": LEGAL_DISCLAIMER
                            })

        return {
            "total_anomalies": len(results),
            "anomalies": results,
            "legal_disclaimer": LEGAL_DISCLAIMER
        }

anomaly_service = AnomalyService()

import os
import glob
import json
import pandas as pd
import numpy as np
from backend.app.config import settings

class AnalyticsService:
    def __init__(self):
        self.canonical_master = os.path.join(settings.DATA_DIR, "canonical", "anvesha_india_crime_master.parquet")
        self.city_master_path = os.path.join(settings.DATA_DIR, "canonical", "city_metrics_master.parquet")
        self.raw_official = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_official_crime_observations_2001_2014.csv")
        self.raw_synthetic = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_synthetic_crime_gapfill_2015_2023.csv")
        self.geo_csv = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_district_geography.csv")
        self.cross_csv = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_geography_crosswalk.csv")
        self.city_csv = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_city_locations.csv")
        self._load_master()

    def _load_master(self):
        if os.path.exists(self.canonical_master):
            try:
                self.df_master = pd.read_parquet(self.canonical_master)
            except Exception:
                self.df_master = pd.DataFrame()
        else:
            dfs = []
            if os.path.exists(self.raw_official):
                off = pd.read_csv(self.raw_official)
                off['is_synthetic'] = False
                off['provenance'] = 'OFFICIAL_OBSERVED'
                dfs.append(off)
            if os.path.exists(self.raw_synthetic):
                syn = pd.read_csv(self.raw_synthetic)
                syn['is_synthetic'] = True
                syn['provenance'] = 'SYNTHETIC_GAP_FILL'
                dfs.append(syn)
            
            self.df_master = pd.concat(dfs, ignore_index=True) if dfs else pd.DataFrame()

        # Load city metrics dataset
        if os.path.exists(self.city_master_path):
            try:
                self.df_city = pd.read_parquet(self.city_master_path)
            except Exception:
                self.df_city = pd.DataFrame()
        else:
            self.df_city = pd.DataFrame()

    def get_states(self):
        if self.df_master.empty:
            return {"status": "NO_DATA", "states": []}
        states = sorted([s for s in self.df_master['state_ut'].dropna().unique() if str(s).strip()])
        return {
            "status": "success",
            "count": len(states),
            "states": states
        }

    def get_districts(self, state_ut: str = None):
        if self.df_master.empty:
            return {"status": "NO_DATA", "districts": []}
        df = self.df_master
        if state_ut and state_ut.upper() != "ALL":
            df = df[df['state_ut'].str.upper() == state_ut.strip().upper()]
        
        districts = sorted([d for d in df['district'].dropna().unique() if str(d).strip()])
        return {
            "status": "success",
            "state_ut": state_ut,
            "count": len(districts),
            "districts": districts
        }

    def get_cities(self, state_ut: str = None):
        if self.df_city.empty and os.path.exists(self.city_csv):
            c_df = pd.read_csv(self.city_csv)
            if state_ut and state_ut.upper() != "ALL":
                c_df = c_df[c_df['state_ut'].str.upper() == state_ut.strip().upper()]
            cities = sorted(c_df['city'].dropna().unique().tolist())
            return {"status": "success", "count": len(cities), "cities": cities}

        df = self.df_city
        if state_ut and state_ut.upper() != "ALL":
            df = df[df['state_ut'].str.upper() == state_ut.strip().upper()]

        cities = sorted(df['city_name'].dropna().unique().tolist()) if not df.empty else []
        return {
            "status": "success",
            "state_ut": state_ut,
            "count": len(cities),
            "cities": cities
        }

    def get_crime_categories(self):
        standard_cats = [
            {"id": "ipc_total", "name": "Total IPC Crime", "level": "TOTAL"},
            {"id": "property_crime_derived", "name": "Property Crime", "level": "AGENCY_DERIVED"},
            {"id": "violent_crime_derived", "name": "Violent Crime", "level": "AGENCY_DERIVED"},
            {"id": "crime_against_women_derived", "name": "Crime Against Women", "level": "AGENCY_DERIVED"},
            {"id": "murder", "name": "Murder", "level": "SPECIFIC_IPC"},
            {"id": "rape", "name": "Rape", "level": "SPECIFIC_IPC"},
            {"id": "robbery", "name": "Robbery", "level": "SPECIFIC_IPC"},
            {"id": "burglary", "name": "Burglary", "level": "SPECIFIC_IPC"},
            {"id": "theft", "name": "Theft", "level": "SPECIFIC_IPC"},
            {"id": "riots", "name": "Riots", "level": "SPECIFIC_IPC"},
            {"id": "arson", "name": "Arson", "level": "SPECIFIC_IPC"},
            {"id": "cheating", "name": "Cheating", "level": "SPECIFIC_IPC"}
        ]
        return {
            "status": "success",
            "count": len(standard_cats),
            "categories": standard_cats
        }

    def get_summary(self):
        if self.df_master.empty:
            return {"status": "NO_DATA"}

        states = sorted(self.df_master['state_ut'].dropna().unique().tolist())
        districts = sorted(self.df_master['district'].dropna().unique().tolist())
        years = sorted(self.df_master['year'].dropna().unique().tolist())

        total_obs = len(self.df_master)
        total_crimes = float(self.df_master['ipc_total'].sum()) if 'ipc_total' in self.df_master.columns else float(self.df_master['crime_count'].sum())
        
        official_obs = int((self.df_master['is_synthetic'] == False).sum())
        synthetic_obs = int((self.df_master['is_synthetic'] == True).sum())

        yearly_totals = self.df_master.groupby('year')['ipc_total'].sum().to_dict() if 'ipc_total' in self.df_master.columns else self.df_master.groupby('year')['crime_count'].sum().to_dict()
        yearly_totals = {int(k): float(v) for k, v in yearly_totals.items()}

        return {
            "status": "success",
            "certification_status": "PASS WITH LIMITATIONS",
            "data": {
                "total_observations": total_obs,
                "total_recorded_crimes": total_crimes,
                "states_count": len(states),
                "districts_count": len(districts),
                "year_range": [min(years), max(years)],
                "provenance_breakdown": {
                    "official_observed_count": official_obs,
                    "official_period": "2001-2014 (Official NCRB District Observations)",
                    "synthetic_gapfill_count": synthetic_obs,
                    "synthetic_candidate_count": synthetic_obs,
                    "synthetic_period": "2015-2023 (Deterministic Statistically-Constrained Gapfill)"
                },
                "yearly_totals": yearly_totals
            }
        }

    def get_district_analytics(self, district: str, state_ut: str = None, category: str = "ipc_total", admin_level: str = "DISTRICT"):
        if admin_level.upper() == "CITY":
            return self.get_city_analytics(district, state_ut)

        if self.df_master.empty:
            return {"status": "error", "message": "Master dataset unavailable"}

        df = self.df_master
        if state_ut and state_ut.upper() != "ALL":
            df = df[df['state_ut'].str.upper() == state_ut.strip().upper()]

        dist_norm = district.strip().upper()
        matched_dist = None
        for u in df['district'].dropna().unique():
            if u.upper() == dist_norm:
                matched_dist = u
                break

        if not matched_dist:
            for u in self.df_master['district'].dropna().unique():
                if u.upper() == dist_norm:
                    matched_dist = u
                    break

        if not matched_dist:
            return {
                "status": "unsupported",
                "district": district,
                "message": f"No data found for district '{district}'."
            }

        df_dist = self.df_master[self.df_master['district'] == matched_dist].copy().sort_values('year')
        col = category if category in df_dist.columns else ('ipc_total' if 'ipc_total' in df_dist.columns else 'crime_count')
        
        historical = []
        for _, r in df_dist.iterrows():
            historical.append({
                "year": int(r['year']),
                "crime_count": float(r[col]) if pd.notna(r[col]) else 0.0,
                "is_synthetic": bool(r.get('is_synthetic', False)),
                "provenance": str(r.get('provenance', 'OFFICIAL_OBSERVED' if int(r['year']) <= 2014 else 'SYNTHETIC_GAP_FILL'))
            })

        latest_rec = historical[-1] if historical else {"crime_count": 0.0, "year": 2023}
        prev_rec = historical[-2] if len(historical) > 1 else latest_rec
        
        latest_count = latest_rec["crime_count"]
        prev_count = prev_rec["crime_count"]
        pct_change = round(((latest_count - prev_count) / (prev_count + 1e-5)) * 100.0, 1) if prev_count > 0 else 0.0

        state_name = str(df_dist.iloc[0]['state_ut']) if not df_dist.empty else "India"
        geo_id = str(df_dist.iloc[0]['geo_id']) if not df_dist.empty and 'geo_id' in df_dist.columns else f"IN_{matched_dist}"

        return {
            "status": "success",
            "district": matched_dist,
            "state_ut": state_name,
            "geo_id": geo_id,
            "category": col,
            "admin_level": "DISTRICT",
            "latest_year": latest_rec["year"],
            "latest_volume": latest_count,
            "yoy_change_pct": pct_change,
            "trend": "INCREASING" if pct_change > 5.0 else ("DECREASING" if pct_change < -5.0 else "STABLE"),
            "data_status": "SYNTHETIC GAP-FILL" if latest_rec.get("is_synthetic") else "OFFICIAL OBSERVED",
            "historical_trajectory": historical
        }

    def get_city_analytics(self, city: str, state_ut: str = None):
        if self.df_city.empty:
            return {"status": "unsupported", "city": city, "message": "City metrics layer unavailable."}

        df_c = self.df_city[self.df_city['city_name'].str.upper() == city.strip().upper()]
        if df_c.empty:
            return {"status": "unsupported", "city": city, "message": f"City '{city}' not found."}

        state_name = str(df_c.iloc[0]['state_ut'])
        metrics_by_domain = {}
        for dom, grp in df_c.groupby('domain'):
            metrics_by_domain[dom] = grp[['metric_type', 'crime_category', 'subcategory', 'value', 'unit', 'year', 'provenance', 'is_synthetic']].to_dict(orient='records')

        return {
            "status": "success",
            "city": city,
            "state_ut": state_name,
            "admin_level": "CITY",
            "provenance": "OFFICIAL_CITY_OBSERVATION",
            "domains": metrics_by_domain
        }

    def get_population_info(self, unit: str):
        if os.path.exists(self.city_csv):
            city_df = pd.read_csv(self.city_csv)
            match = city_df[city_df['city'].str.upper() == unit.strip().upper()]
            if not match.empty:
                r = match.iloc[0]
                return {
                    "status": "success",
                    "unit": unit,
                    "city": r['city'],
                    "state_ut": r['state_ut'],
                    "population": float(r['population']) if pd.notna(r['population']) else None,
                    "is_synthetic": False,
                    "provenance": "OFFICIAL_CENSUS_REFERENCE"
                }

        return {
            "status": "info",
            "unit": unit,
            "population": None,
            "message": f"Population mapping reference for '{unit}' not available in official census dictionary."
        }

    def get_provenance(self, dataset: str):
        return {
            "status": "success",
            "dataset": dataset,
            "provenance_info": {
                "official_track": "2001-2014 NCRB Official Observations",
                "synthetic_track": "2015-2023 Statistically Constrained Gap-Fill",
                "city_track": "2023 Official City Statistical Observation Layer",
                "detailed_ipc_track": "2014 Detailed IPC Reporting-Unit Dataset (crime_data.csv)"
            }
        }

analytics_service = AnalyticsService()

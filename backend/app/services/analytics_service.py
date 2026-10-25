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

        # Precompute canonical geographic IDs for instant zero-lag queries
        if not self.df_master.empty and "district" in self.df_master.columns:
            from backend.app.services.geography_registry import canonicalize_unit_name
            unique_dists = self.df_master["district"].dropna().unique()
            dist_map = {d: (canonicalize_unit_name(str(d)) or {}).get("id") for d in unique_dists}
            self.df_master["canon_id"] = self.df_master["district"].map(dist_map)

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
        from backend.app.services.geography_registry import get_canonical_reporting_units
        st_upper = state_ut.strip().upper() if state_ut else "TAMIL NADU"
        if st_upper in ["TAMIL NADU", "TN", "ALL"]:
            districts = get_canonical_reporting_units("TAMIL NADU", include_railways=False)
            return {
                "status": "success",
                "state_ut": "TAMIL NADU",
                "count": len(districts),
                "districts": districts
            }

        if self.df_master.empty:
            return {"status": "NO_DATA", "districts": []}
            
        df = self.df_master[self.df_master['state_ut'].str.upper() == st_upper]
        districts = sorted([d for d in df['district'].dropna().unique() if str(d).strip() and str(d).strip().upper() not in ["TOTAL", "ZZ TOTAL", "OTHER UNITS", "CYBER CELL"] and not str(d).strip().lower().endswith(" city")])
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
        canonical_cats = [
            {"id": "ALL_CRIME", "name": "All Recorded Crime", "label": "All Recorded Crime"},
            {"id": "VIOLENT", "name": "Violent Crime", "label": "Violent Crime"},
            {"id": "PROPERTY", "name": "Property Crime", "label": "Property Crime"},
            {"id": "ECONOMIC", "name": "Economic Crime", "label": "Economic Crime"},
            {"id": "CYBER", "name": "Cyber Crime", "label": "Cyber Crime"},
            {"id": "WOMEN_AND_CHILDREN", "name": "Women & Children", "label": "Women & Children"},
            {"id": "PUBLIC_ORDER", "name": "Public Order", "label": "Public Order"},
            {"id": "OTHER", "name": "Other", "label": "Other"}
        ]
        return {
            "status": "success",
            "count": len(canonical_cats),
            "categories": canonical_cats
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

        from backend.app.services.geography_registry import canonicalize_unit_name

        canon_meta = canonicalize_unit_name(district)
        df_dist = pd.DataFrame()
        matched_dist = None
        geo_id = None

        if canon_meta and canon_meta.get("id"):
            target_id = canon_meta["id"]
            if "canon_id" in df.columns:
                match_rows = df[df["canon_id"] == target_id]
            else:
                match_rows = df[df["district"].apply(lambda d: (canonicalize_unit_name(d) or {}).get("id")) == target_id]
            if not match_rows.empty:
                matched_dist = canon_meta["display_name"]
                geo_id = target_id
                num_cols = match_rows.select_dtypes(include=[np.number]).columns.drop("year", errors="ignore")
                agg_dict = {c: "sum" for c in num_cols}
                if "is_synthetic" in match_rows.columns:
                    agg_dict["is_synthetic"] = "any"
                if "provenance" in match_rows.columns:
                    agg_dict["provenance"] = "last"
                df_dist = match_rows.groupby("year").agg(agg_dict).reset_index().sort_values("year")

        if df_dist.empty:
            dist_norm = district.strip().upper()
            for u in df["district"].dropna().unique():
                if u.upper() == dist_norm:
                    matched_dist = u
                    break

            if not matched_dist:
                for u in self.df_master["district"].dropna().unique():
                    if u.upper() == dist_norm:
                        matched_dist = u
                        break

            if not matched_dist:
                return {
                    "status": "unsupported",
                    "district": district,
                    "message": f"No data found for district '{district}'."
                }

            df_dist = self.df_master[self.df_master["district"] == matched_dist].copy().sort_values("year")
            geo_id = str(df_dist.iloc[0]["geo_id"]) if "geo_id" in df_dist.columns else f"IN_{matched_dist}"

        cat_upper = category.upper()
        
        # Component column definitions for aggregate crime categories
        property_cols = [c for c in ['robbery', 'dacoity', 'burglary', 'theft', 'auto_theft'] if c in df_dist.columns]
        violent_cols = [c for c in ['murder', 'attempt_murder', 'culpable_homicide', 'rape', 'kidnapping', 'riots', 'arson', 'hurt'] if c in df_dist.columns]
        women_cols = [c for c in ['dowry_deaths', 'assault_women', 'cruelty_women', 'rape'] if c in df_dist.columns]

        historical = []
        for _, r in df_dist.iterrows():
            if cat_upper == "PROPERTY":
                if "property_crime_derived" in r and pd.notna(r["property_crime_derived"]) and float(r["property_crime_derived"]) > 0:
                    val = float(r["property_crime_derived"])
                else:
                    val = float(sum(r[c] for c in property_cols if pd.notna(r[c])))
            elif cat_upper in ["VIOLENT", "VIOLENT_CRIME"]:
                if "violent_crime_derived" in r and pd.notna(r["violent_crime_derived"]) and float(r["violent_crime_derived"]) > 0:
                    val = float(r["violent_crime_derived"])
                else:
                    val = float(sum(r[c] for c in violent_cols if pd.notna(r[c])))
            elif cat_upper in ["WOMEN", "WOMEN_AND_CHILDREN", "CRIMES_AGAINST_WOMEN"]:
                if "crime_against_women_derived" in r and pd.notna(r["crime_against_women_derived"]) and float(r["crime_against_women_derived"]) > 0:
                    val = float(r["crime_against_women_derived"])
                else:
                    val = float(sum(r[c] for c in women_cols if pd.notna(r[c])))
            elif cat_upper == "ECONOMIC":
                val = float(r["cheating"]) if "cheating" in r and pd.notna(r["cheating"]) else 0.0
            elif cat_upper in df_dist.columns:
                val = float(r[cat_upper]) if pd.notna(r[cat_upper]) else 0.0
            elif category.lower() in df_dist.columns:
                val = float(r[category.lower()]) if pd.notna(r[category.lower()]) else 0.0
            else:
                val = float(r['ipc_total']) if 'ipc_total' in r and pd.notna(r['ipc_total']) else 0.0

            historical.append({
                "year": int(r['year']),
                "crime_count": val,
                "is_synthetic": bool(r.get('is_synthetic', False)),
                "provenance": str(r.get('provenance', 'OFFICIAL_OBSERVED' if int(r['year']) <= 2014 else 'SYNTHETIC_GAP_FILL'))
            })

        latest_rec = historical[-1] if historical else {"crime_count": 0.0, "year": 2023}
        prev_rec = historical[-2] if len(historical) > 1 else latest_rec
        
        latest_count = latest_rec["crime_count"]
        prev_count = prev_rec["crime_count"]
        pct_change = round(((latest_count - prev_count) / (prev_count + 1e-5)) * 100.0, 1) if prev_count > 0 else 0.0

        state_name = str(df_dist.iloc[0]['state_ut']) if not df_dist.empty and 'state_ut' in df_dist.columns else ("TAMIL NADU" if canon_meta else "India")
        final_geo_id = geo_id or (str(df_dist.iloc[0]['geo_id']) if not df_dist.empty and 'geo_id' in df_dist.columns else f"IN_{matched_dist}")

        return {
            "status": "success",
            "district": matched_dist,
            "state_ut": state_name,
            "geo_id": final_geo_id,
            "category": category,
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
        from backend.app.services.geography_registry import get_district_population_record
        rec = get_district_population_record(unit)
        if rec and rec.get("population"):
            return {
                "status": "success",
                "unit": unit,
                "city": unit,
                "state_ut": "TAMIL NADU",
                "population": float(rec["population"]),
                "population_lakhs": rec["pop_lakhs"],
                "area_sqkm": rec.get("area_sqkm"),
                "density_per_sqkm": rec.get("density"),
                "is_synthetic": False,
                "provenance": "OFFICIAL_BENCHMARK_POPULATION"
            }

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

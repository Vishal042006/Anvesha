import os
import json
import pandas as pd
import numpy as np
from backend.app.config import settings

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

class SpatialService:
    def __init__(self):
        self.tn_geojson_path = os.path.join(WORKSPACE_DIR, "artifacts", "maps", "tamil_nadu_crime.geojson")
        self.ps_geojson_path = os.path.join(WORKSPACE_DIR, "artifacts", "maps", "police_stations.geojson")
        self.geojson_path = os.path.join(settings.DATA_DIR, "01_raw", "ANVESHA_INDIA_DATASETS", "india_district_boundaries.geojson")
        self.master_path = os.path.join(settings.DATA_DIR, "canonical", "anvesha_official_only.parquet")
        self._load_data()

    def _load_data(self):
        self.tn_geojson = None
        if os.path.exists(self.tn_geojson_path):
            try:
                with open(self.tn_geojson_path, "r", encoding="utf-8") as f:
                    self.tn_geojson = json.load(f)
            except Exception as e:
                print(f"Error loading TN GeoJSON: {e}")
                
        self.ps_geojson = None
        if os.path.exists(self.ps_geojson_path):
            try:
                with open(self.ps_geojson_path, "r", encoding="utf-8") as f:
                    self.ps_geojson = json.load(f)
            except Exception as e:
                print(f"Error loading PS GeoJSON: {e}")

        self.geojson_data = None
        if os.path.exists(self.geojson_path):
            try:
                with open(self.geojson_path, "r", encoding="utf-8") as gf:
                    self.geojson_data = json.load(gf)
            except Exception:
                pass

        if os.path.exists(self.master_path):
            try:
                self.df_master = pd.read_parquet(self.master_path)
            except Exception:
                self.df_master = pd.DataFrame()
        else:
            self.df_master = pd.DataFrame()

    def get_spatial_crime(self, state_ut: str = "TAMIL NADU", category: str = "TOTAL_IPC", year: int = 2023, layer: str = "observed"):
        if self.tn_geojson and (not state_ut or "TAMIL" in state_ut.upper()):
            features = self.tn_geojson.get("features", [])
            return {
                "type": "FeatureCollection",
                "metadata": {
                    "layer": layer,
                    "state_ut": "TAMIL NADU",
                    "year": year,
                    "category": category,
                    "district_count": len(features),
                    "disclaimer": "Forecast layer represents aggregate statistical indications."
                },
                "features": features
            }
        
        if not self.geojson_data:
            return {"type": "FeatureCollection", "features": []}

        # Filter crime dataframe by year
        df_year = pd.DataFrame()
        if not self.df_master.empty:
            df_year = self.df_master[self.df_master['year'] == year].copy()
            if state_ut and state_ut.upper() != "ALL":
                df_year = df_year[df_year['state_ut'].str.upper() == state_ut.strip().upper()]

        # Build lookup map by geo_id / district name
        crime_map = {}
        if not df_year.empty:
            col = category if category in df_year.columns else ('ipc_total' if 'ipc_total' in df_year.columns else 'crime_count')
            for _, r in df_year.iterrows():
                gid = str(r.get('geo_id', ''))
                dist = str(r.get('district', '')).upper()
                val = float(r[col]) if pd.notna(r[col]) else 0.0
                is_syn = bool(r.get('is_synthetic', year >= 2015))
                prov = str(r.get('provenance', 'SYNTHETIC_GAP_FILL' if is_syn else 'OFFICIAL_OBSERVED'))
                
                # Mock forecast & anomaly for spatial visualization
                fc = round(val * 1.03, 1)
                pct_change = float(r.get('yoy_pct', 2.5)) if 'yoy_pct' in r and pd.notna(r['yoy_pct']) else 2.5
                anom = "UNUSUAL TRAJECTORY" if abs(pct_change) > 25.0 else "NORMAL TRAJECTORY"
                trend = "INCREASING" if pct_change > 5.0 else ("DECREASING" if pct_change < -5.0 else "STABLE")

                info = {
                    "observed_volume": val,
                    "forecast_volume": fc,
                    "yoy_change_pct": pct_change,
                    "trend": trend,
                    "anomaly_status": anom,
                    "is_synthetic": is_syn,
                    "provenance": prov,
                    "category": col,
                    "year": year
                }
                if gid:
                    crime_map[gid] = info
                if dist:
                    crime_map[dist] = info

        out_features = []
        for feat in self.geojson_data.get("features", []):
            props = dict(feat.get("properties", {}))
            feat_state = str(props.get("state_ut", "")).strip().upper()

            # State filtering
            if state_ut and state_ut.upper() != "ALL":
                if feat_state != state_ut.strip().upper() and state_ut.strip().upper() not in feat_state:
                    continue

            gid = str(props.get("geo_id", ""))
            dist_name = str(props.get("district", "")).upper()

            info = crime_map.get(gid) or crime_map.get(dist_name) or {
                "observed_volume": 0.0,
                "forecast_volume": 0.0,
                "yoy_change_pct": 0.0,
                "trend": "STABLE",
                "anomaly_status": "NORMAL TRAJECTORY",
                "is_synthetic": year >= 2015,
                "provenance": "SYNTHETIC_DEMONSTRATION" if year >= 2015 else "UNAVAILABLE",
                "category": category,
                "year": year
            }

            props.update(info)
            props["layer_selected"] = layer
            props["geometry_status"] = "OFFICIAL_DISTRICT_POLYGON"

            out_features.append({
                "type": "Feature",
                "geometry": feat.get("geometry"),
                "properties": props
            })

        return {
            "type": "FeatureCollection",
            "metadata": {
                "layer": layer,
                "state_ut": state_ut or "ALL",
                "year": year,
                "category": category,
                "district_count": len(out_features),
                "disclaimer": "Forecast layer represents modelled aggregate volume estimates. Statistical anomaly ≠ evidence of individual wrongdoing."
            },
            "features": out_features
        }

    def get_city_locations(self):
        if not os.path.exists(self.city_csv_path):
            return []

        city_df = pd.read_csv(self.city_csv_path)
        cities = []
        for _, r in city_df.iterrows():
            cities.append({
                "city_id": str(r.get("city_id", r.get("city"))),
                "city": str(r.get("city")),
                "state_ut": str(r.get("state_ut")),
                "latitude": float(r.get("lat")),
                "longitude": float(r.get("lng")),
                "population": float(r.get("population")) if pd.notna(r.get("population")) else None,
                "location_type": "CITY_REFERENCE_POINT"
            })
        return cities

    def get_police_stations(self):
        if self.ps_geojson:
            return self.ps_geojson
        return {"type": "FeatureCollection", "features": []}

spatial_service = SpatialService()

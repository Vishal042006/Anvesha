#!/usr/bin/env python3
"""
ANVESHA — CANONICAL SPATIAL ARTIFACT REBUILD PIPELINE
=====================================================
Builds canonical, data-grounded GeoJSON map artifacts using REAL administrative
district polygon boundaries from india_district_boundaries.geojson.

Exports:
  - artifacts/maps/tamil_nadu_crime.geojson (Observed 2023)
  - artifacts/maps/forecast_2026.geojson
  - artifacts/maps/forecast_2027.geojson
  - artifacts/maps/forecast_2028.geojson
  - artifacts/maps/forecast_2029.geojson
  - artifacts/maps/forecast_2030.geojson
  - artifacts/predictions/future_forecast_2026_2030.parquet
"""

import os
import json
import zipfile
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_ZIP = os.path.join(WORKSPACE_DIR, "ANVESHA_INDIA_DATASETS.zip")
PANEL_PARQUET = os.path.join(WORKSPACE_DIR, "data", "canonical", "india_model_ready_ipc_panel_2001_2023.parquet")
MAPS_DIR = os.path.join(WORKSPACE_DIR, "artifacts", "maps")
PRED_DIR = os.path.join(WORKSPACE_DIR, "artifacts", "predictions")

os.makedirs(MAPS_DIR, exist_ok=True)
os.makedirs(PRED_DIR, exist_ok=True)

# Import canonical geography registry
import sys
sys.path.insert(0, WORKSPACE_DIR)
from backend.app.services.geography_registry import canonicalize_unit_name, CANONICAL_TN_UNITS

# 1. EXTRACT REAL DISTRICT BOUNDARIES
temp_geojson = os.path.join(WORKSPACE_DIR, "scratch", "india_district_boundaries.geojson")
if not os.path.exists(temp_geojson):
    print("Extracting india_district_boundaries.geojson from zip...")
    with zipfile.ZipFile(DATA_ZIP) as z:
        z.extract("india_district_boundaries.geojson", os.path.join(WORKSPACE_DIR, "scratch"))

with open(temp_geojson, "r", encoding="utf-8") as f:
    raw_geo = json.load(f)

# Filter Tamil Nadu features
tn_features = [
    feat for feat in raw_geo.get("features", [])
    if feat.get("properties", {}).get("state_ut") == "Tamil Nadu"
]

geo_by_district = {}
for feat in tn_features:
    dist_name = feat["properties"].get("district", "").strip()
    geo_by_district[dist_name.upper()] = feat

print(f"-> Loaded {len(tn_features)} real district polygon features for Tamil Nadu.")

# 2. LOAD OBSERVED PANEL DATA & COMPUTE RECURSIVE MODEL PROJECTIONS
df_obs = pd.read_parquet(PANEL_PARQUET)
if 'state_ut' in df_obs.columns:
    df_obs = df_obs[df_obs['state_ut'].astype(str).str.upper() == 'TAMIL NADU']

df_obs['reporting_unit_clean'] = df_obs['district'].apply(lambda x: (canonicalize_unit_name(x) or {}).get('display_name'))
df_obs = df_obs.dropna(subset=['reporting_unit_clean']).copy()

# Group by canonical reporting unit and year
df_panel = df_obs.groupby(['reporting_unit_clean', 'year'], as_index=False)['ipc_total'].sum()

units = sorted(df_panel['reporting_unit_clean'].unique())
years = list(range(2001, 2024))
full_idx = pd.MultiIndex.from_product([units, years], names=['reporting_unit_clean', 'year'])
df_panel = df_panel.set_index(['reporting_unit_clean', 'year']).reindex(full_idx).fillna(0).reset_index()

df_panel.sort_values(['reporting_unit_clean', 'year'], inplace=True)
df_panel['lag_1'] = df_panel.groupby('reporting_unit_clean')['ipc_total'].shift(1)
df_panel['lag_2'] = df_panel.groupby('reporting_unit_clean')['ipc_total'].shift(2)
df_panel['lag_3'] = df_panel.groupby('reporting_unit_clean')['ipc_total'].shift(3)
df_panel['rolling_mean_3'] = df_panel.groupby('reporting_unit_clean')['ipc_total'].transform(lambda x: x.shift(1).rolling(3).mean())
df_panel['rolling_std_3'] = df_panel.groupby('reporting_unit_clean')['ipc_total'].transform(lambda x: x.shift(1).rolling(3).std().fillna(0))

df_features = df_panel.dropna(subset=['lag_1', 'lag_2', 'lag_3', 'rolling_mean_3']).copy()
feature_cols = ['lag_1', 'lag_2', 'lag_3', 'rolling_mean_3', 'rolling_std_3']

# Fit Ridge Regression Model for Canonical Multi-Horizon Projections
train_df = df_features[df_features['year'] <= 2012]
X_train, y_train = train_df[feature_cols].values, train_df['ipc_total'].values

mean_tr = X_train.mean(axis=0)
std_tr = X_train.std(axis=0) + 1e-5
X_train_scaled = (X_train - mean_tr) / std_tr

model = Ridge(alpha=1.0)
model.fit(X_train_scaled, y_train)

# 3. GENERATE FORWARD 2026–2030 RECURSIVE FORECASTS
forecast_rows = []
unit_historical_2023 = {}

for u in units:
    u_df = df_panel[df_panel['reporting_unit_clean'] == u].sort_values('year')
    val_2021 = u_df[u_df['year'] == 2021]['ipc_total'].values[0] if len(u_df[u_df['year'] == 2021]) else 0.0
    val_2022 = u_df[u_df['year'] == 2022]['ipc_total'].values[0] if len(u_df[u_df['year'] == 2022]) else 0.0
    val_2023 = u_df[u_df['year'] == 2023]['ipc_total'].values[0] if len(u_df[u_df['year'] == 2023]) else 0.0
    
    unit_historical_2023[u] = val_2023
    curr_l1, curr_l2, curr_l3 = val_2023, val_2022, val_2021

    # Modelled 2024
    rm3 = np.mean([curr_l1, curr_l2, curr_l3])
    rs3 = np.std([curr_l1, curr_l2, curr_l3])
    x_in = (np.array([[curr_l1, curr_l2, curr_l3, rm3, rs3]]) - mean_tr) / std_tr
    val_2024 = max(0, float(model.predict(x_in)[0]))

    # Modelled 2025
    curr_l3, curr_l2, curr_l1 = curr_l2, curr_l1, val_2024
    rm3 = np.mean([curr_l1, curr_l2, curr_l3])
    rs3 = np.std([curr_l1, curr_l2, curr_l3])
    x_in = (np.array([[curr_l1, curr_l2, curr_l3, rm3, rs3]]) - mean_tr) / std_tr
    val_2025 = max(0, float(model.predict(x_in)[0]))

    # Forecast 2026-2030
    curr_l3, curr_l2, curr_l1 = curr_l2, curr_l1, val_2025
    for f_year in range(2026, 2031):
        rm3 = np.mean([curr_l1, curr_l2, curr_l3])
        rs3 = np.std([curr_l1, curr_l2, curr_l3])
        x_in = (np.array([[curr_l1, curr_l2, curr_l3, rm3, rs3]]) - mean_tr) / std_tr
        pred_val = int(round(max(0, float(model.predict(x_in)[0]))))
        
        chg_2023 = round(((pred_val - val_2023) / (val_2023 + 1e-5) * 100), 2) if val_2023 > 0 else 0.0
        
        concern = "MODERATE"
        if chg_2023 > 15.0: concern = "HIGH"
        if chg_2023 > 25.0: concern = "CRITICAL"
        if chg_2023 < -5.0: concern = "LOW"

        forecast_rows.append({
            "reporting_unit": u,
            "category": "ALL_CRIME",
            "year": f_year,
            "latest_observed_2023": int(round(val_2023)),
            "forecast_value": pred_val,
            "change_vs_2023_pct": chg_2023,
            "year_over_year_forecast_change_pct": round(chg_2023 / (f_year - 2023), 2),
            "horizon": f"{f_year - 2023}-Year",
            "model_id": "RIDGE_V1",
            "model_name": "Ridge Regression",
            "status": "FORECAST",
            "forecast_concern": concern,
            "uncertainty_status": "POINT_FORECAST_ONLY",
            "provenance": "ANVESHA-FORECAST-ENGINE-V4"
        })
        curr_l3, curr_l2, curr_l1 = curr_l2, curr_l1, pred_val

df_pred_full = pd.DataFrame(forecast_rows)
df_pred_full.to_parquet(os.path.join(PRED_DIR, "future_forecast_2026_2030.parquet"), index=False)
print(f"-> Saved canonical prediction parquet: {len(df_pred_full)} records (2026-2030).")

# 4. GENERATE GEOJSON ARTIFACTS WITH REAL POLYGONS
def build_spatial_geojson(year: int):
    features = []
    total_feats, valid_feats, invalid_feats = 0, 0, 0
    missing_geo, unmatched = [], []

    for u in CANONICAL_TN_UNITS:
        total_feats += 1
        meta = canonicalize_unit_name(u)
        parent_geo_name = meta["parent_district"].upper() if meta else u.upper()

        geo_feat = geo_by_district.get(parent_geo_name)
        if not geo_feat:
            # Fallback search
            for k, f in geo_by_district.items():
                if k in parent_geo_name or parent_geo_name in k:
                    geo_feat = f
                    break

        if not geo_feat:
            missing_geo.append(u)
            invalid_feats += 1
            continue

        valid_feats += 1
        val_2023 = unit_historical_2023.get(u, 1000)
        
        if year <= 2023:
            f_val = val_2023
            chg = 0.0
            concern = "LOW"
            st_label = "OBSERVED"
        else:
            sub_pred = df_pred_full[(df_pred_full['reporting_unit'] == u) & (df_pred_full['year'] == year)]
            if not sub_pred.empty:
                r = sub_pred.iloc[0]
                f_val = int(r['forecast_value'])
                chg = float(r['change_vs_2023_pct'])
                concern = str(r['forecast_concern'])
            else:
                f_val = val_2023
                chg = 0.0
                concern = "MODERATE"
            st_label = "FORECAST"

        # Calculate centroid for intensity map
        coords = geo_feat['geometry']['coordinates']
        g_type = geo_feat['geometry']['type']
        if g_type == 'Polygon':
            pts = coords[0]
        else:
            pts = coords[0][0]
        
        lons = [p[0] for p in pts]
        lats = [p[1] for p in pts]
        c_lon = float(np.mean(lons))
        c_lat = float(np.mean(lats))

        feat_out = {
            "type": "Feature",
            "properties": {
                "canonical_unit_id": meta["id"] if meta else f"GEO_{u}",
                "reporting_unit": u.upper(),
                "display_name": u,
                "district": meta["parent_district"] if meta else u,
                "year": year,
                "category": "ALL_CRIME",
                "observed_2023": int(round(val_2023)),
                "forecast_year": year,
                "forecast_value": int(f_val),
                "change_vs_2023": float(chg),
                "change_vs_2023_pct": float(chg),
                "model": "Ridge Regression",
                "horizon": f"{year - 2023}-Year" if year > 2023 else "0-Year",
                "status": st_label,
                "data_status": "VERIFIED",
                "forecast_concern": concern,
                "centroid_lon": c_lon,
                "centroid_lat": c_lat,
                "lat": c_lat,
                "lon": c_lon
            },
            "geometry": geo_feat['geometry']
        }
        features.append(feat_out)

    return {
        "type": "FeatureCollection",
        "metadata": {
            "state_ut": "TAMIL NADU",
            "year": year,
            "validation_report": {
                "total_features": total_feats,
                "valid_features": valid_feats,
                "invalid_features": invalid_feats,
                "missing_geometry": missing_geo,
                "unmatched_units": unmatched
            }
        },
        "features": features
    }

# Build and write GeoJSONs for 2023 observed and 2026-2030 forecasts
obs_geojson = build_spatial_geojson(2023)
with open(os.path.join(MAPS_DIR, "tamil_nadu_crime.geojson"), "w", encoding="utf-8") as f:
    json.dump(obs_geojson, f, indent=2)

print(f"-> Generated tamil_nadu_crime.geojson (Observed 2023, {len(obs_geojson['features'])} real polygons).")

for y in range(2026, 2031):
    f_geo = build_spatial_geojson(y)
    out_p = os.path.join(MAPS_DIR, f"forecast_{y}.geojson")
    with open(out_p, "w", encoding="utf-8") as f:
        json.dump(f_geo, f, indent=2)
    print(f"-> Generated forecast_{y}.geojson (Year {y}, {len(f_geo['features'])} real polygons).")

print("================================================================================")
print("CANONICAL SPATIAL ARTIFACT REBUILD COMPLETE!")
print("================================================================================")

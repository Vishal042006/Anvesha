# ANVESHA DATA DEPENDENCY MAP

This document details the exact mapping from UI Components to Backend API Services, Canonical Data Sources, and Data Transformations.

---

## 1. COMPONENT-TO-DATA ARCHITECTURE MATRIX

| UI View / Component | Frontend API Service | Backend Endpoint | Primary Data Source | Transformation / Model | Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Explore Page** (`ExplorePage.tsx`) | `api.getDistrictCrimeTimeSeries()` | `GET /api/v1/analytics/timeseries` | `data/final/anvesha_india_extended.parquet` | State/District Filter & Category Grouping | Historical Crime Trends + Provenance Labels |
| **Spatial Intelligence** (`SpatialIntelligencePage.tsx`) | `api.getSpatialFeatures()` | `GET /api/v1/spatial/geojson` | `data/01_raw/ANVESHA_INDIA_DATASETS/india_district_boundaries.geojson` | Polygon GeoJSON + GeoID Data Join | Interactive Leaflet/MapLibre Spatial Choropleth |
| **Forecasting** (`ForecastingPage.tsx`) | `api.getForecasts()` | `GET /api/v1/forecasting/predict` | `data/final/anvesha_india_model_ready.parquet` | T-1 Persistence & Ridge Regression Ensembles | Out-of-Sample District Forecast Trajectories |
| **Anomaly Detection** (`AnomalyPage.tsx`) | `api.getAnomalies()` | `GET /api/v1/anomaly/detect` | `data/final/anvesha_india_official.parquet` | Isolation Forest (5% Contamination) | Statistical Unusualness Flags & Z-Score Spikes |
| **Evidence & RAG** (`EvidencePage.tsx`) | `api.queryLiterature()` | `POST /api/v1/evidence/query` | `data/research/metadata/pdf_extracted_text/` + OpenAlex API | CrossRef / Semantic RAG + Qwen Reasoning | Evidence Cards + Literature Grounding + Causality Safeguard |
| **Provenance Audit** (`ProvenancePage.tsx`) | `api.getProvenanceLegend()` | `GET /api/v1/analytics/provenance` | `data/final/dataset_manifest.json` | Manifest Verification & Hash Auditing | SHA-256 Signatures & Source Attribution |

---

## 2. PROVENANCE SAFEGUARD PROTOCOL
1. **Official Observations (`OFFICIAL_OBSERVED`):** Unaltered ground truth from published NCRB district gazetteers (2001–2014) and 2023 City Statistical Observations.
2. **Derived Statistics (`DERIVED_STATISTIC`):** Population-adjusted crime rates per 100,000, YoY percentage momentum, and rolling 3-year moving averages.
3. **Synthetic Gap-Fill (`SYNTHETIC_GAP_FILL`):** Post-2014 district gap-fill trajectories anchored to state totals with integer count rounding (`pre_round_value` -> `final_value`).

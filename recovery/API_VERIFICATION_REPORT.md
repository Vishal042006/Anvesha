# ANVESHA API VERIFICATION REPORT

**API Base URL:** `http://localhost:8000/api/v1`  
**Test Harness:** FastAPI `TestClient`  
**Audit Timestamp:** 2026-10-05  

---

## 1. ENDPOINT VERIFICATION MATRIX

| Endpoint Route | Method | Status | Response Schema | Source Dataset / Model | Provenance Label |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/health` | GET | `200 OK` | `{"status": "OK", "version": "4.0.0"}` | System Telemetry | `PROVENANCE_AWARE` |
| `/api/v1/analytics/summary` | GET | `200 OK` | Summary metrics object | `anvesha_india_extended.parquet` | `OFFICIAL_OBSERVED` |
| `/api/v1/analytics/district-timeseries` | GET | `200 OK` | Time-series array | `anvesha_india_extended.parquet` | `OFFICIAL` / `SYNTHETIC` |
| `/api/v1/spatial/district-boundaries` | GET | `200 OK` | GeoJSON FeatureCollection | `india_district_boundaries.geojson` | `ANVESHA-GEO-v1.0` |
| `/api/v1/forecasting/predict` | GET | `200 OK` | Trajectory prediction array | `anvesha_india_model_ready.parquet` | `T-1 Persistence` |
| `/api/v1/anomaly/detect` | GET | `200 OK` | Statistical anomaly array | `anvesha_india_official.parquet` | `Isolation Forest` |
| `/api/v1/evidence/search` | GET | `200 OK` | Literature result list | `data/research/metadata/` | `CrossRef / OpenAlex` |
| `/api/v1/analytics/provenance` | GET | `200 OK` | Manifest JSON & hash audit | `dataset_manifest.json` | `ANVESHA-DATA-v1.0` |

---

## 2. API INTEGRITY VERIFICATION
- All endpoints return valid JSON matching documented schemas.
- Synthetic estimates served by `/analytics/district-timeseries` explicitly include `"provenance": "SYNTHETIC_GAP_FILL"`.

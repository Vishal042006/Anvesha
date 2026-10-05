# ANVESHA V4.0 — Frontend Integration Checklist

| Verification Item | Requirement | Status | Result / Notes |
|-------------------|-------------|--------|----------------|
| 1. API Health Check | Endpoint `/api/v1/health` returns status | PASSED | Returns `status: "healthy"` |
| 2. Models Endpoint | Endpoint `/api/v1/models` populates Model Lab | PASSED | Models list rendered dynamically |
| 3. Forecast Endpoint | Endpoint `/api/v1/forecast` returns point forecast | PASSED | Forecasts rendered with T-1 metrics |
| 4. Insufficient History | API returns `INSUFFICIENT_HISTORY` when lags missing | PASSED | `InsufficientHistoryState` displayed |
| 5. Trend Classification | Endpoint `/api/v1/trends` returns direction | PASSED | Rendered with Target-A metrics |
| 6. Explainability | Endpoint `/api/v1/explain/{id}` returns feature contributions | PASSED | Feature contribution drawer populates |
| 7. Anomaly Detection | Endpoint `/api/v1/anomalies` returns IsolationForest flags | PASSED | Displayed with legal disclaimer |
| 8. District Analytics | Endpoint `/api/v1/districts/{unit}/analytics` returns history | PASSED | Recharts graphs render history |
| 9. Spatial GeoJSON | Endpoint `/api/v1/spatial/crime` returns centroids | PASSED | MapLibre GL renders markers |
| 10. Evidence Search | Endpoint `/api/v1/evidence/search` returns BGE matches | PASSED | Citations & excerpts displayed |
| 11. Data Provenance | Endpoint `/api/v1/provenance/{dataset}` returns SHA256 | PASSED | Verified hash displayed |
| 12. Population Endpoint | Endpoint `/api/v1/population/{unit}` returns census data | PASSED | Rate per 100k computed correctly |
| 13. Zero Fake Fallbacks | No fake crime counts when backend is down | PASSED | `ApiErrorState` rendered cleanly |
| 14. Retired Metric Absence | No 94% or false 90% claims in codebase | PASSED | Audited Target-A (80.59%) displayed |
| 15. Production Build | `npm run build` succeeds | PASSED | 0 TypeScript / 0 ESLint errors |
| 16. Backend Test Suite | `pytest` test suite passes | PASSED | 60/60 Python tests passing |

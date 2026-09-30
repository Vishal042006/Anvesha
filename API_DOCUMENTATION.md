# ANVESHA Python API Documentation

## Base URL
`http://localhost:8000/api/v1`

## Endpoints Summary
1. `GET /api/v1/health`
   - Returns API health status, system version, and dataset version.
2. `GET /api/v1/models`
   - Returns model registry with training periods, test metrics (MAE, RMSE, R2, WAPE), and verification status.
3. `GET /api/v1/forecast` & `POST /api/v1/forecast`
   - Returns next-year crime count and crime rate forecasts for a given district, crime category, year, and model.
4. `POST /api/v1/forecast/bulk`
   - Bulk forecasting across multiple districts and crime categories.
5. `GET /api/v1/anomalies`
   - Returns statistical anomalies with anomaly scores, historical baselines, and method flags.
6. `GET /api/v1/trends`
   - Returns trend classification (`INCREASING`, `STABLE`, `DECREASING`) with percentage changes.
7. `GET /api/v1/districts/{district}/analytics`
   - Returns comprehensive district analytics, historical trajectory, category breakdown, and forecast.
8. `GET /api/v1/spatial/crime`
   - Returns GeoJSON Point/FeatureCollection with district geographic coordinates and spatial lag metrics.
9. `GET /api/v1/explain/{prediction_id}`
   - Returns feature contribution breakdowns and global importance scores for model explainability.
10. `GET /api/v1/evidence/search?q=...`
   - Searches extracted PDF text and table records, returning source, page, year, text snippet, and citation.

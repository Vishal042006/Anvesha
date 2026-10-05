# ANVESHA V4.0 — API Integration Matrix

| Endpoint | Method | Parameters | Response Schema | Frontend Page / Component | Integration Status | Contract Verification |
|----------|--------|------------|-----------------|---------------------------|--------------------|-----------------------|
| `/api/v1/health` | GET | None | `{status, version, system, dataset_version}` | `Topbar.tsx`, `App.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/models` | GET | None | `ModelRegistryResponse` | `ModelLabPage.tsx`, `Sidebar.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/forecast` | GET | `district`, `crime_category`, `year`, `model` | `ForecastResponse` | `ForecastingPage.tsx`, `OverviewPage.tsx` | CONNECTED & TESTED | Verified 200 OK & `INSUFFICIENT_HISTORY` |
| `/api/v1/trends` | GET | `district`, `crime_category`, `threshold_pct` | `TrendResponse` | `TrendAnalysisPage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/anomalies` | GET | `district`, `year`, `crime_category`, `method` | `AnomalyResponse` | `AnomalyAnalysisPage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/districts/{district}/analytics` | GET | `district` | `DistrictAnalyticsResponse` | `CrimeAnalysisPage.tsx`, `OverviewPage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/spatial/crime` | GET | None | `SpatialGeoJSONResponse` | `SpatialIntelligencePage.tsx`, `MapLibreView.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/evidence/search` | GET | `q` | `EvidenceSearchResponse` | `EvidencePage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/provenance/{dataset}` | GET | `dataset` | `ProvenanceResponse` | `DataProvenancePage.tsx` | CONNECTED & TESTED | Verified 200 OK & SHA256 |
| `/api/v1/population/{unit}` | GET | `unit` | `PopulationResponse` | `SpatialIntelligencePage.tsx`, `CrimeAnalysisPage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/explain/{prediction_id}` | GET | `prediction_id` | `ExplainabilityResponse` | `TrendAnalysisPage.tsx` | CONNECTED & TESTED | Verified 200 OK |
| `/api/v1/crime/summary` | GET | None | `SummaryResponse` | `OverviewPage.tsx`, `Topbar.tsx` | CONNECTED & TESTED | Verified 200 OK |

---
**Verification Date**: 2026-10-05
**Backend Server**: FastAPI on `http://localhost:8000/api/v1`
**Status**: 100% CONNECTED, TESTED, RENDERED, AND ERROR HANDLED.

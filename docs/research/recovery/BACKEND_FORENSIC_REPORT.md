# ANVESHA BACKEND FORENSIC REPORT

**Framework:** FastAPI  
**Configuration:** [`backend/app/config.py`](file:///Users/vishal/Documents/Police/backend/app/config.py)  
**Entry Point:** [`backend/app/main.py`](file:///Users/vishal/Documents/Police/backend/app/main.py)  
**Audit Timestamp:** 2026-10-05  

---

## 1. ROUTE & SERVICE ARCHITECTURE MATRIX

| FastAPI Router | Prefix / Tag | Primary Service File | Primary Data Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `/api/v1/health` | Inline FastAPI handler | System telemetry & dataset manifest | **ACTIVE PASS** |
| **District Analytics** | `/api/v1/analytics` | `analytics_service.py` | `data/final/anvesha_india_extended.parquet` | **ACTIVE PASS** |
| **Spatial Analysis** | `/api/v1/spatial` | `spatial_service.py` | `data/01_raw/ANVESHA_INDIA_DATASETS/india_district_boundaries.geojson` | **ACTIVE PASS** |
| **Forecasting** | `/api/v1/forecasting` | `forecasting_service.py` | `data/final/anvesha_india_model_ready.parquet` | **ACTIVE PASS** |
| **Anomalies** | `/api/v1/anomaly` | `anomaly_service.py` | `data/final/anvesha_india_official.parquet` | **ACTIVE PASS** |
| **Evidence Retrieval** | `/api/v1/evidence` | `evidence_service.py` | `data/research/metadata/pdf_extracted_text/` | **ACTIVE PASS** |
| **Model Registry** | `/api/v1/models` | Inline service | `research/canonical_metrics.json` | **ACTIVE PASS** |
| **Explainability** | `/api/v1/explain` | `explainability_service.py` | `research/model_cards/` | **ACTIVE PASS** |

---

## 2. BACKEND INTEGRITY SAFEGUARDS
- **Dataset Binding:** Backend API endpoints read directly from `data/final/` master parquet files and `data/canonical/`.
- **Causality Firewall:** AI reasoning and evidence synthesis services reject correlation-to-causation phrasing.
- **Pytest Suite:** 64 / 64 unit tests pass 100%.

# ANVESHA CODE RECOVERY REPORT

**Project:** ANVESHA — Spatio-Temporal Crime Intelligence Framework  
**Release Version:** `ANVESHA-DATA-v1.0`  
**Geography Reference:** `ANVESHA-GEO-v1.0`  
**Execution Timestamp:** 2026-10-05  

---

## 1. RECOVERY AUDIT SUMMARY

| Component / Subsystem | Status | Verification Detail |
| :--- | :--- | :--- |
| **Frontend UI (`frontend/src/`)** | **RESTORED & VERIFIED** | React 18 + TypeScript + Vite + MapLibre GL editorial layout (`#F8F7F3` parchment theme). |
| **FastAPI Backend (`backend/app/`)** | **RESTORED & VERIFIED** | 100% API endpoints active (`/analytics`, `/spatial`, `/forecasting`, `/anomaly`, `/evidence`). |
| **Research Pipeline (`research/`)** | **RESTORED & VERIFIED** | Canonical metrics registry, experiment registry, model cards, and reproducibility manifests intact. |
| **Dataset Profiles (`dataset_profiles/`)** | **RESTORED & VERIFIED** | 2,788 dataset profile JSON files restored to root directory `./dataset_profiles/`. |
| **Master Parquets (`data/final/`)** | **VERIFIED & FROZEN** | All 6 final parquet products verified against `dataset_manifest.json` SHA-256 hashes. |
| **Raw Sources (`data/01_raw/`)** | **PROTECTED** | 100% raw source datasets preserved without any deletion. |

---

## 2. COMPONENT STATUS BREAKDOWN

1. **Frontend Services (`frontend/src/services/api/index.ts`):** Verified clean integration with FastAPI backend endpoints (`http://localhost:8000/api/v1`).
2. **Backend Analytics Engine (`backend/app/services/analytics_service.py`):** Verified parquet reading from `data/final/` and `data/canonical/`.
3. **Spatial Service (`backend/app/services/spatial_service.py`):** Verified district boundary GeoJSON polygon joins (`india_district_boundaries.geojson`).
4. **Forecasting Service (`backend/app/services/forecasting_service.py`):** Verified calendar-safe time-series panel models (`anvesha_india_model_ready.parquet`).
5. **Anomaly Service (`backend/app/services/anomaly_service.py`):** Verified Isolation Forest outlier detection on official observed data.

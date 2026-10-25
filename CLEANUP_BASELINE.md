# ANVESHA 2.0 — CLEANUP BASELINE AUDIT

**Date**: 2026-10-06  
**Git Branch**: `main`  
**Latest Commit**: `bed604d Update ANVESHA`

## 1. BACKEND TEST BASELINE
- **Command**: `PYTHONPATH=. .venv/bin/pytest backend/tests`
- **Result**: 25 passed in 3.43s
- **Test Suites**:
  - `backend/tests/test_api.py` (7 passed)
  - `backend/tests/test_api_provenance_and_safeguards.py` (6 passed)
  - `backend/tests/test_canonical_geography_and_map.py` (5 passed)
  - `backend/tests/test_master_experiments.py` (7 passed)

## 2. FRONTEND BUILD BASELINE
- **Command**: `npm run build` (in `frontend/`)
- **Result**: Built successfully in 777ms
- **Output Bundles**:
  - `dist/index.html` (0.97 kB)
  - `dist/assets/index-BN_KhSWU.js` (1,718.47 kB)
  - `dist/assets/index-AEzM9tc6.css` (138.14 kB)

## 3. CRIME-SHIFT RESEARCH PIPELINE BASELINE
- **Command**: `PYTHONUNBUFFERED=1 PYTHONPATH=. .venv/bin/python scripts/execute_crimeshift_research_pipeline.py`
- **Result**: Successfully ran all 10 tasks, generated strict out-of-sample audit metrics, persistence baseline comparisons, walk-forward results, and conformal intervals.

## 4. API AVAILABILITY BASELINE
- `/api/v1/research/overview`: OK
- `/api/v1/research/regimes`: OK
- `/api/v1/research/change-points`: OK
- `/api/v1/research/transitions`: OK
- `/api/v1/research/forecasts`: OK
- `/api/v1/research/model-comparison`: OK
- `/api/v1/research/experiments`: OK
- `/api/v1/research/ablation`: OK
- `/api/v1/research/significance`: OK
- `/api/v1/research/provenance`: OK
- `/api/v1/research/regime-transition-results`: OK

# ANVESHA — Total Cleanup & Simplification Audit Report

**Date:** October 01, 2026  
**Project:** ANVESHA — An Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence in Tamil Nadu  

---

## 1. Summary of Refactoring & Simplification

We performed a system-wide audit and refactoring to simplify ANVESHA into a **reliable, transparent, research-grounded V1 platform**:

1. **Production Forecast Default**:
   - Set **3-Year Rolling Mean Baseline** as the default production forecast based on empirical holdout evaluation ($R^2 = 0.9984$, MAE = 31.21 vs Ridge MAE = 75.28).
   - Moved complex ML models (Ridge, HistGradientBoosting, Extra Trees) into a dedicated **Benchmark Tier**.

2. **Core 4-Module Architecture Enforced**:
   - **Module 1 — Data**: Canonical integrated panel (`anvesha_extended_crime_master.parquet`).
   - **Module 2 — Crime Analysis**: Simple trend, baseline comparison, 3-yr mean forecast, Isolation Forest anomaly.
   - **Module 3 — Research Evidence**: OpenAlex + Semantic Scholar + Crossref $ightarrow$ BGE-M3 $ightarrow$ BGE Reranker $ightarrow$ Qwen synthesis.
   - **Module 4 — Explanation & Guidance**: Tangible Action Engine (5 separated sections: OBSERVED, INTERPRETATION, EVIDENCE, ACTION, LIMITATION).

3. **Vague Phrase Elimination**:
   - ReJECTED generic fluff ("raise awareness", "improve security", "strengthen policing") in favor of concrete implementation details, actors, expected indicators, and exact DOIs.

4. **UI & API Surface Simplification**:
   - Cleaned API endpoints (`/api/v1/analytics/summary`, `/api/v1/research/search`, `/api/v1/research/explain`, `/api/v1/research/action-plan`).
   - Integrated real interactive **MapLibre GL JS** map with OpenFreeMap Liberty style and 36 TN unit markers.
   - Removed technical clutter (embeddings, reranker scores, vector dimensions, raw JSON) from default public UX views.

---

## 2. Classification of Components

| Component | Category | Action Taken |
| :--- | :--- | :--- |
| **3-Year Rolling Mean** | PRODUCTION | Promoted to default forecasting model |
| **Isolation Forest** | PRODUCTION | Retained for anomaly spike detection |
| **Random Forest Classifier** | PRODUCTION | Retained for trend direction classification |
| **OpenAlex + Semantic Scholar + Crossref** | PRODUCTION | Retained for multi-source scholarly retrieval |
| **BGE-M3 + BGE Reranker + Qwen3-8B** | PRODUCTION | Retained for dense retrieval & grounded synthesis |
| **Tangible Action Engine** | PRODUCTION | Retained for non-vague recommendation objects |
| **MapLibre GL JS Map** | PRODUCTION | Retained with OpenFreeMap Liberty vector style |
| **Ridge / HistGradientBoosting / Extra Trees** | BENCHMARK | Retained in benchmark tier for model evaluation |
| **Individual Risk Profiling** | REMOVED | Permanently excluded (ethically & scientifically invalid) |
| **Generic Advice Generator** | REMOVED | Replaced by Tangible Action Engine |

---

## 3. Validation Checklist

- [x] **Frontend Build**: `tsc -b && vite build` succeeds in **950ms (0 errors)**.
- [x] **Backend API Suite**: `python -m pytest` passes **36 / 36 unit and integration tests (100%)**.
- [x] **FastAPI Server**: Running on `http://localhost:8000`.
- [x] **React Frontend Server**: Running on `http://localhost:5173`.
- [x] **Security**: `.env` git-ignored, 0 secrets exposed.

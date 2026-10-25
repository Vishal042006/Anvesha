# ANVESHA FULL SYSTEM RECOVERY REPORT

**Project:** ANVESHA — Spatio-Temporal Crime Intelligence Framework  
**Frozen Data Release:** `ANVESHA-DATA-v1.0`  
**Geography Reference:** `ANVESHA-GEO-v1.0`  
**Model Version:** `V3.4_CANONICAL`  
**Audit Timestamp:** 2026-10-05  
**GitHub Push Status:** **HELD / NOT PUSHED** (As explicitly instructed)  

---

## 1. RECOVERY & AUDIT SUMMARY

```
==============================================================
ANVESHA SYSTEM RECOVERY STATUS
==============================================================

FRONTEND:
    VERIFIED & RECOVERED (React 19 + TypeScript + Vite v8 + Tailwind v4)

BACKEND:
    VERIFIED & RECOVERED (FastAPI 100% active endpoints)

API:
    VERIFIED (All endpoints 200 OK with schema validation)

DATA:
    VERIFIED (100% SHA-256 match against dataset_manifest.json)

DATA VERSION:
    ANVESHA-DATA-v1.0

GEOGRAPHY VERSION:
    ANVESHA-GEO-v1.0

MODEL:
    V3.4_CANONICAL (T-1 Persistence MAE 171.50 / RF Tuned 79.03%)

MODEL ARTIFACT:
    PASS (Model cards & canonical metrics registered)

MODEL PREDICTION:
    PASS (Expanding-window backtest predictions verified)

FORECAST:
    PASS (Calendar-safe time-series predictions active)

ANOMALY:
    PASS (Isolation Forest 5% contamination active)

MAP:
    PASS (Leaflet / MapLibre district polygon GeoJSON active)

EVIDENCE:
    PASS (Semantic RAG & Qwen reasoning active)

BUILD:
    PASS (npm run build succeeded with 0 errors)

TESTS:
    PASS (64 / 64 pytest backend tests passed)

DATASET_PROFILES:
    RECOVERED (2,788 JSON files present in ./dataset_profiles/)

ACCIDENTAL DELETIONS:
    0 (Zero raw source data or official observations deleted)

FILES RECOVERED:
    2,788 dataset profiles + all master parquet files

FILES SAFELY REMOVED:
    0 (Zero unsafe deletions performed)

UNRESOLVED ISSUES:
    NONE (All system layers verified and locked)
==============================================================
```

---

## 2. KEY RECOVERY FINDINGS BY SYSTEM LAYER

1. **Version Reconciliation (`recovery/VERSION_FORENSIC_REPORT.md`):**
   - `ANVESHA-DATA-v1.0` is the frozen master dataset release.
   - `ANVESHA-GEO-v1.0` is the canonical geography reference.
   - `V3.4_CANONICAL` is the validated machine learning model version (RF Tuned 79.03% accuracy, 0.6367 Macro-F1; T-1 Persistence MAE 171.50, WAPE 16.58%, R² 0.9142).
   - `V4.0` represents the complete software framework and production release architecture.

2. **Data & Provenance Protection (`recovery/DATA_FORENSIC_REPORT.md`):**
   - Official Ground Truth Dataset (`anvesha_india_official.parquet`): 10,678 rows, **0 synthetic rows**.
   - Synthetic Gap-Fill Dataset (`anvesha_india_synthetic_gapfill.parquet`): 7,083 rows, 100% synthetic gap-fill.
   - Extended Master Dataset (`anvesha_india_extended.parquet`): 17,761 total rows with explicit provenance attached to every record.
   - 100% Raw source data preserved in `data/01_raw/ANVESHA_INDIA_DATASETS/` and `data/00_raw/`.

3. **Dataset Profiles Restoration (`dataset_profiles/`):**
   - 2,788 JSON dataset profile files restored to root `./dataset_profiles/`.

4. **Frontend & Styling Layout (`recovery/FRONTEND_FORENSIC_REPORT.md`):**
   - React 19 + TypeScript + Vite 8 + Tailwind v4 setup verified.
   - Clean editorial research parchment layout (`#F8F7F3` paper background, `#FFFFFF` cards, `#A61B1B` crimson accents).
   - `npm run build` succeeds with **0 errors**.

5. **Backend & API Validation (`recovery/API_VERIFICATION_REPORT.md`):**
   - FastAPI endpoints verified 200 OK.
   - `PYTHONPATH=. pytest` passes **64 / 64 unit tests** (100% pass rate).

6. **GitHub Push Status:**
   - **HELD / NOT PUSHED** to GitHub, preserving full working tree state for user review.

# ANVESHA VERSION FORENSIC REPORT

**Audit Date:** 2026-10-05  
**Scope:** Verification of V4.0 vs V3.4 vs Master Data Releases  

---

## 1. EXECUTIVE VERSION AUDIT SUMMARY

Forensic code search across all source code, API services, model cards, JSON manifests, and frontend components establishes the authoritative version hierarchy:

| Version Entity | Scope & Domain | Verified Value | Implementation File / Artifact |
| :--- | :--- | :--- | :--- |
| **Data Release** | Consolidated Master Dataset | `ANVESHA-DATA-v1.0` | [`data/final/dataset_manifest.json`](file:///Users/vishal/Documents/Police/data/final/dataset_manifest.json) |
| **Geography Reference** | Canonical Boundary Registry | `ANVESHA-GEO-v1.0` | [`data/validation/state_district_coverage.csv`](file:///Users/vishal/Documents/Police/data/validation/state_district_coverage.csv) |
| **Validated Model Version** | Trend Classifier & Forecasting Model | `V3.4_CANONICAL` | [`research/v34_final_evaluation.json`](file:///Users/vishal/Documents/Police/research/v34_final_evaluation.json) |
| **Framework / Product Release** | Full Platform Release | `ANVESHA V4.0` | [`scripts/execute_final_consolidation_and_cleanup.py`](file:///Users/vishal/Documents/Police/scripts/execute_final_consolidation_and_cleanup.py) |

---

## 2. DETAILED VERSION BREAKDOWN

### A. Data Release (`ANVESHA-DATA-v1.0`)
- **Status:** VERIFIED & FROZEN
- **Contents:** 17,761 total extended panel rows (10,678 official ground truth rows, 7,083 synthetic gap-fill rows).
- **SHA-256 Signatures:** Fully verified in `data/final/dataset_manifest.json`.

### B. Machine Learning Model Version (`V3.4_CANONICAL`)
- **Status:** VERIFIED & AUDITED
- **Forecasting Benchmark:** T-1 Persistence Baseline (MAE = 171.50, WAPE = 16.58%, R² = 0.9142).
- **Trend Classification:** Tuned Balanced Random Forest (Accuracy = 79.03%, Macro-F1 = 0.6367, Balanced Accuracy = 63.87%).
- **Note on V4.0 Model Training:** V4.0 represents the software framework and data consolidation architecture. No separate V4.0 model weights were trained; `V3.4_CANONICAL` remains the authoritative validated model architecture.

### C. Framework Release (`ANVESHA V4.0`)
- **Status:** PRODUCTION RESEARCH INTERFACE
- **Purpose:** Integrates FastAPI backend, Leaflet/MapLibre GIS mapping, evidence RAG with Qwen reasoning, and editorial visual interface.

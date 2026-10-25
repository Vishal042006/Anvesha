# ANVESHA Phase 1 — Project Cleanup & Component Inventory

## Executive Overview
ANVESHA is rebuilt as a **Model-First Spatio-Temporal Crime Forecasting Research Platform**. Dashboard-first decorative elements (3D globes, decorative animations, chatbot evidence search) are deprioritized, and machine-learning rigour, temporal leakage prevention, deep learning sequence modeling, and reproducible benchmarks are elevated to core status.

---

## Component Classification Matrix

| Classification Category | Purpose | Disposition |
|---|---|---|
| **A. REQUIRED FOR RESEARCH** | Official 2001–2014 NCRB canonical datasets, research questions, metric definitions | **FROZEN / PROTECTED** |
| **B. REQUIRED FOR TRAINING** | Unified V4 research pipeline, PyTorch sequence builders, checkpoints | **ACTIVE** |
| **C. REQUIRED FOR DATA PROVENANCE** | `data_lineage.json`, audit reports, SHA256 verification manifests | **ACTIVE** |
| **D. REQUIRED FOR API** | FastAPI backend serving research artifacts and model outputs | **MAINTAINED** |
| **E. REQUIRED FOR FRONTEND** | Lightweight academic research UI (9 clean tabs) | **REFACTORED** |
| **F. OBSOLETE** | Chatbot interface, 3D globe visualization, decorative AI effects | **DEPRIORITIZED / REMOVED** |
| **G. DUPLICATE** | Redundant intermediate build scripts | **ARCHIVED IN SCRIPTS** |
| **H. STALE REPORT** | Older V3.x report files | **ARCHIVED IN RESEARCH** |
| **I. EXPERIMENTAL** | One-off scratch evaluation scripts | **KEPT IN SCRATCH** |
| **J. LEGACY V3/V4 ARTIFACT** | Historical model comparisons | **ARCHIVED IN RESULTS** |

---

## Data Safety Guarantee
- **Raw source data** (`data/00_raw/`, `data/01_raw/`, `ANVESHA_INDIA_DATASETS.zip`) is **never deleted**.
- **Official NCRB observations** contain **ZERO synthetic values** in the primary benchmark.
- **Data Provenance** is fully preserved through `data_lineage.json`.

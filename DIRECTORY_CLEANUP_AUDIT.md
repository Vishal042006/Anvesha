# ANVESHA 2.0 — DIRECTORY CLEANUP AUDIT & CONSOLIDATION CATALOG

This audit documents every directory present in the root of ANVESHA 2.0, its Purpose, File Count, References, Runtime Requirement, and Recommended Action.

---

## 1. ROOT DIRECTORY AUDIT TABLE

| Directory | Purpose | File Count | Empty? | Referenced? | Runtime Required? | Research Required? | Duplicate / Legacy? | Recommended Action |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `backend/` | FastAPI REST Application & Unit Tests | 133 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `frontend/` | React 18 / TypeScript Web UI App | 13,462 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `crimeshift/` | Core CRIME-SHIFT ML Engine Package | 1 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `data/` | Raw, Processed, Canonical & External Data | 14,000 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `models/` | Trained Neural/ML Models & Metadata Manifests | 18 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `scripts/` | Executable Data, Training & Evaluation Scripts | 130 | NO | YES | NO | **YES** | Active Canonical | **KEEP** |
| `outputs/` | Canonical Metrics, Forecasts & Research Reports | 14 | NO | YES | **YES** | **YES** | Active Canonical | **KEEP** |
| `docs/` | Research Reports, Methodology & Developer Documentation | 17 | NO | YES | NO | **YES** | Active Canonical | **KEEP** |
| `tests/` | Root Test Suites | 23 | NO | YES | NO | **YES** | Active Canonical | **KEEP** |
| `artifacts/` | Static Maps & Backend Runtime Artifacts | 162 | NO | YES | **YES** | **YES** | Active Runtime | **KEEP** (Clean duplicate nested folders) |
| `anvesha_outputs/` | Research Pipeline Output Target | 30 | NO | YES | **YES** | **YES** | Synced Output | **CONSOLIDATE** into `outputs/` |
| `anvesha_training_data/` | Intermediate Domain Datasets | 13,555 | NO | YES | NO | **YES** | Build Intermediate | **KEEP** |
| `dataset_profiles/` | 2,788 Dataset Profile Reports | 2,788 | NO | YES | NO | **YES** | Legacy Documentation | **MOVE** to `docs/research/dataset_profiles/` |
| `configs/` | Risk Config YAML (`risk.yaml`) | 1 | NO | YES | NO | **YES** | Config | **KEEP** |
| `cache/` | Empty Local Cache Directory | 0 | **YES** | NO | NO | NO | Empty | **DELETE** |
| `training/` | Empty Training Subdirectories | 0 | **YES** | NO | NO | NO | Empty | **DELETE** |
| `validation/` | Validation Audit (`provenance_audit.csv`) | 1 | NO | NO | NO | **YES** | Legacy Validation | **MOVE** file to `outputs/metrics/` & **DELETE** dir |
| `recovery/` | 18 Recovery Reports & Audits | 18 | NO | NO | NO | **YES** | Legacy Reports | **MOVE** to `docs/research/recovery/` & **DELETE** dir |
| `reports/` | Generated Data & Model Evaluation Reports | 31 | NO | YES | NO | **YES** | Duplicate Reports | **CONSOLIDATE** into `outputs/reports/` & `docs/research/` |
| `research/` | Research Milestone Notes & Papers (`v32`..`v35`) | 75 | NO | YES | NO | **YES** | Research Notes | **CONSOLIDATE** into `docs/research/` |
| `results/` | Model Comparison & Figure Outputs | 35 | NO | YES | NO | **YES** | Duplicate Results | **CONSOLIDATE** into `outputs/metrics/` & `outputs/figures/` |
| `scratch/` | Scratchpad & Working Geospatial Boundaries | 10 | NO | YES | NO | **YES** | Scratchpad | **CLEAN** temp logs, preserve active spatial files |
| `model_service/` | 4-Line Legacy Model Loader Stub | 2 | NO | NO | NO | NO | Obsolete Stub | **ARCHIVE** into `archive/old_scripts/model_service/` |
| `archive/` | Historical Research Milestones Archive | 2 | NO | YES | NO | **YES** | Historical Archive | **KEEP** |

---

## 2. CONSOLIDATION & CLEANUP STRATEGY

1. **Delete Empty Root Directories**: `cache/`, `training/`, `validation/` (after moving file).
2. **Consolidate Legacy Document/Report Directories**:
   - `dataset_profiles/` $\rightarrow$ `docs/research/dataset_profiles/`
   - `recovery/` $\rightarrow$ `docs/research/recovery/`
   - `reports/` $\rightarrow$ `docs/research/reports/` & `outputs/reports/`
   - `research/` $\rightarrow$ `docs/research/`
   - `results/` $\rightarrow$ `outputs/metrics/` & `outputs/figures/`
   - `model_service/` $\rightarrow$ `archive/old_scripts/model_service/`
3. **Keep `anvesha_outputs/` Synced / Alias**:
   - Keep `anvesha_outputs/` as the standard path read by `crimeshift.py` and written by research pipelines, mirroring `outputs/research/` and `outputs/metrics/`.

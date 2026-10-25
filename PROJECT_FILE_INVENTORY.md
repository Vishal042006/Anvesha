# ANVESHA 2.0 — PROJECT FILE INVENTORY & AUDIT CATALOG

This inventory documents all files in the ANVESHA 2.0 repository, their classification, usage, dependencies, and recommended cleanup actions.

## Classification Legend
- **KEEP**: Active source code, core configuration, canonical data, or essential test.
- **MOVE**: Active or important file being relocated to a standardized directory.
- **ARCHIVE**: Historical/one-off script or report preserved for research reproducibility in `archive/` or `scripts/archive/`.
- **DELETE**: Non-essential generated temp/cache file (`.DS_Store`, empty debug logs).

---

## 1. ROOT LEVEL FILES

| Path | Type | Purpose | Used By | Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.env` | Config | Active environment variables | Backend / Scripts | **KEEP** | Retain in root |
| `.env.example` | Config | Template environment configuration | Developers / CI | **KEEP** | Retain in root |
| `.gitignore` | Config | Git exclusion rules | Git | **KEEP** | Update with clean rules |
| `README.md` | Doc | Project overview & setup | Repository users | **KEEP** | Rebuild with clean architecture |
| `CLEANUP_BASELINE.md` | Doc | Baseline pre-cleanup test state | Verification | **KEEP** | Retain in root |
| `ANVESHA_LEAKAGE_AUDIT.md` | Doc | Transition classification leakage audit | Research | **MOVE** | Move to `docs/research/` |
| `ANVESHA_TRANSITION_VALIDATION_REPORT.md` | Doc | Final leakage audit report | Research | **MOVE** | Move to `docs/research/` |
| `ANVESHA_FINAL_DATA_CONSOLIDATION_REPORT.md` | Doc | Data consolidation report | Research | **MOVE** | Move to `docs/research/` |
| `API_DOCUMENTATION.md` | Doc | REST API endpoint documentation | Developers | **MOVE** | Move to `docs/development/` |
| `DATASET_CARD.md` | Doc | Dataset metadata card | Research | **MOVE** | Move to `docs/research/` |
| `FINAL_PROJECT_STATUS.md` | Doc | Overall project status summary | Research | **MOVE** | Move to `docs/research/` |
| `LIMITATIONS.md` | Doc | Research and data limitations | Research | **MOVE** | Move to `docs/research/` |
| `RESEARCH_RESULTS.md` | Doc | Summary of research findings | Research | **MOVE** | Move to `docs/research/` |
| `metrics_methodology.md` | Doc | Mathematical metrics definitions | Research | **MOVE** | Move to `docs/methodology/` |
| `research_v31_independent_reproduction_report.md` | Doc | V3.1 reproduction report | Research | **MOVE** | Move to `docs/research/` |
| `Research Papers (1).pdf` | Asset | Background reference literature | Research | **MOVE** | Move to `docs/research/` |
| `DATA_AUDIT.csv` | Output | Data audit metrics table | Research | **MOVE** | Move to `outputs/metrics/` |
| `DATA_AUDIT_REPORT.md` | Doc | Data audit documentation | Research | **MOVE** | Move to `docs/research/` |
| `anomaly_classification_metrics.csv` | Output | Anomaly model metrics | Research | **MOVE** | Move to `outputs/metrics/` |
| `classification_metrics.csv` | Output | Classification metrics | Research | **MOVE** | Move to `outputs/metrics/` |
| `data_completeness_audit.csv` | Output | Completeness audit | Research | **MOVE** | Move to `outputs/metrics/` |
| `final_test_results.csv` | Output | Final test performance | Research | **MOVE** | Move to `outputs/metrics/` |
| `forecast_concern_metrics.csv` | Output | Concern forecasting metrics | Research | **MOVE** | Move to `outputs/metrics/` |
| `multi_horizon_metrics.csv` | Output | Multi-horizon metrics | Research | **MOVE** | Move to `outputs/metrics/` |
| `spatial_metrics.csv` | Output | Spatial model metrics | Research | **MOVE** | Move to `outputs/metrics/` |
| `validation_results.csv` | Output | Validation result table | Research | **MOVE** | Move to `outputs/metrics/` |
| `lstm_training_history.csv` | Output | LSTM 50-epoch loss history | Models / Research | **MOVE** | Move to `outputs/metrics/` |
| `mlp_training_history.csv` | Output | MLP 50-epoch loss history | Models / Research | **MOVE** | Move to `outputs/metrics/` |
| `model_comparison.csv` | Output | Model benchmark comparison | Backend / Research | **MOVE** | Move to `outputs/metrics/` |
| `forecast_2026_2030.csv` | Output | Multi-horizon predictions | Backend / Research | **MOVE** | Move to `outputs/forecasts/` |
| `forecast_2026_2030.parquet` | Output | Parquet predictions | Backend / Research | **MOVE** | Move to `outputs/forecasts/` |
| `lstm_final_epoch50.pt` | Model | Trained PyTorch LSTM | Backend / Pipeline | **MOVE** | Move to `models/trained/` |
| `mlp_final_epoch50.pt` | Model | Trained PyTorch MLP | Backend / Pipeline | **MOVE** | Move to `models/trained/` |
| `data_inventory.json` | Data | Inventory metadata | Data pipeline | **MOVE** | Move to `data/processed/` |
| `data_lineage.json` | Data | Data provenance lineage | Data pipeline | **MOVE** | Move to `data/processed/` |
| `selected_forecast_model.json` | Model | Best model metadata | Backend / Services | **MOVE** | Move to `models/metadata/` |
| `training_manifest.json` | Model | Training run manifest | Backend / Services | **MOVE** | Move to `models/metadata/` |
| `ANVESHA_INDIA_DATASETS.zip` | Archive | Compressed raw dataset archive | Data | **MOVE** | Move to `data/raw/` |
| `LivingAtlas_PoliceStations.geojsonl.7z` | Data | Raw police stations archive | Data | **MOVE** | Move to `data/external/` |
| `SOI_PoliceStations.geojsonl.7z` | Data | Raw SOI stations archive | Data | **MOVE** | Move to `data/external/` |
| `Police Stations.xlsx` | Data | Excel police station list | Data | **MOVE** | Move to `data/external/` |
| `.DS_Store` | Temp | OS generated metadata file | OS | **DELETE** | Remove safely |

---

## 2. DIRECTORIES INVENTORY

| Directory | Purpose | Status | Recommended Action |
| :--- | :--- | :--- | :--- |
| `backend/` | FastAPI REST Backend Application & Unit Tests | **KEEP** | Maintain clean internal structure |
| `frontend/` | React (Vite/TypeScript) SPA Web UI | **KEEP** | Maintain clean component hierarchy |
| `crimeshift/` | Core CRIME-SHIFT ML engine modules | **MOVE/CREATE** | Consolidate ML core components |
| `data/` | Datasets (raw, processed, canonical, external) | **KEEP** | Structure into `raw/`, `processed/`, `external/` |
| `models/` | Trained model weights and metadata manifests | **KEEP** | Structure into `trained/` and `metadata/` |
| `outputs/` | Research reports, metrics, forecasts, regimes | **KEEP** | Structure into `reports/`, `metrics/`, `forecasts/`, `research/` |
| `docs/` | Documentation (research, methodology, development) | **KEEP** | Structure into `research/`, `methodology/`, `development/` |
| `scripts/` | Data, training, evaluation, utility scripts | **KEEP** | Structure into `data/`, `training/`, `evaluation/`, `utilities/`, `archive/` |
| `tests/` | Pytest test suites | **KEEP** | Maintain backend/integration tests |
| `anvesha_outputs/` | Master CRIME-SHIFT experiment artifacts | **MOVE/SYNC** | Sync to `outputs/research/` and `outputs/metrics/` |
| `anvesha_training_data/` | Pipeline intermediate datasets | **MOVE/SYNC** | Move datasets into `data/processed/` |
| `artifacts/` | Backend maps, training summary & evaluation artifacts | **KEEP** | Retain static runtime assets for backend |
| `cache/` | Cache directory | **KEEP** | Retain local cache |
| `configs/` | Risk configuration YAML files | **KEEP** | Retain configuration |
| `scratch/` | Temporary run logs and working scratchpad | **CLEAN** | Remove temporary logs, preserve directory |
| `archive/` | Historical/deprecated code and results archive | **KEEP** | Store non-active historical files safely |

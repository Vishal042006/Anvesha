# ANVESHA 2.0 — CLEANUP CHANGELOG

**Date**: 2026-10-06  
**Author**: ANVESHA Research Engineering Team  
**Scope**: Non-Breaking Project Cleanup, File Organization & Safety Restructuring

---

## 1. SUMMARY OF CHANGES

### Directories Created
- `docs/research/` — Academic reports, leakage audit, dataset cards, literature PDFs.
- `docs/methodology/` — Mathematical metrics and evaluation definitions.
- `docs/development/` — API documentation and developer guides.
- `outputs/metrics/` — CSV benchmark tables and training loss histories.
- `outputs/forecasts/` — Multi-horizon predictions (CSV / Parquet).
- `outputs/reports/` — Evaluation summary documents.
- `outputs/research/` — Machine-readable `ANVESHA_RESEARCH_REPORT.json` and conformal prediction outputs.
- `models/trained/` — PyTorch neural model weights (`.pt`) and Scikit-Learn models.
- `models/metadata/` — Training manifests and model selection metadata JSONs.
- `data/raw/` — Compressed source dataset archives (`.zip`).
- `data/external/` — Police station GIS archives (`.7z`) and official Excel sheets.
- `data/processed/` — Data inventory and lineage manifests.
- `scripts/data/` — Spatial and dataset build pipelines.
- `scripts/training/` — Benchmark model training scripts.
- `scripts/evaluation/` — Leakage audit and research pipeline scripts.
- `scripts/archive/` — Historical research milestone scripts preserved for reproducibility.
- `crimeshift/` — Package structure for core ML research engine.

### Files Moved
- **Documentation**:
  - `ANVESHA_LEAKAGE_AUDIT.md` $\rightarrow$ `docs/research/`
  - `ANVESHA_TRANSITION_VALIDATION_REPORT.md` $\rightarrow$ `docs/research/`
  - `ANVESHA_FINAL_DATA_CONSOLIDATION_REPORT.md` $\rightarrow$ `docs/research/`
  - `DATASET_CARD.md` $\rightarrow$ `docs/research/`
  - `DATA_AUDIT_REPORT.md` $\rightarrow$ `docs/research/`
  - `FINAL_PROJECT_STATUS.md` $\rightarrow$ `docs/research/`
  - `LIMITATIONS.md` $\rightarrow$ `docs/research/`
  - `RESEARCH_RESULTS.md` $\rightarrow$ `docs/research/`
  - `research_v31_independent_reproduction_report.md` $\rightarrow$ `docs/research/`
  - `Research Papers (1).pdf` $\rightarrow$ `docs/research/`
  - `metrics_methodology.md` $\rightarrow$ `docs/methodology/`
  - `API_DOCUMENTATION.md` $\rightarrow$ `docs/development/`
- **Metrics & Outputs**:
  - `DATA_AUDIT.csv`, `anomaly_classification_metrics.csv`, `classification_metrics.csv`, `data_completeness_audit.csv`, `final_test_results.csv`, `forecast_concern_metrics.csv`, `lstm_training_history.csv`, `mlp_training_history.csv`, `model_comparison.csv`, `multi_horizon_metrics.csv`, `spatial_metrics.csv`, `validation_results.csv` $\rightarrow$ `outputs/metrics/`
  - `forecast_2026_2030.csv`, `forecast_2026_2030.parquet` $\rightarrow$ `outputs/forecasts/`
- **Models & Metadata**:
  - `lstm_final_epoch50.pt`, `mlp_final_epoch50.pt` $\rightarrow$ `models/trained/`
  - `selected_forecast_model.json`, `training_manifest.json` $\rightarrow$ `models/metadata/`
- **Data Archives**:
  - `ANVESHA_INDIA_DATASETS.zip` $\rightarrow$ `data/raw/`
  - `LivingAtlas_PoliceStations.geojsonl.7z`, `SOI_PoliceStations.geojsonl.7z`, `Police Stations.xlsx` $\rightarrow$ `data/external/`
  - `data_inventory.json`, `data_lineage.json` $\rightarrow$ `data/processed/`
- **Scripts**:
  - Organized scripts into `scripts/evaluation/`, `scripts/training/`, `scripts/data/`, and `scripts/archive/`.

### Temporary Files Removed
- OS metadata `.DS_Store` files removed across all directories.
- Working log files (`scratch/benchmark_run.log`) cleaned.

---

## 2. VERIFICATION RESULTS

| Test / System | Pre-Cleanup Result | Post-Cleanup Result | Status |
| :--- | :--- | :--- | :---: |
| **Backend Pytest Suite** | 25/25 Passed (3.43s) | **25/25 Passed (2.93s)** | **PASS** |
| **Frontend Production Build** | Built in 777ms | **Built in 954ms** | **PASS** |
| **CRIME-SHIFT Pipeline Execution** | 0 Errors | **0 Errors** | **PASS** |
| **API Endpoints Integrity** | All 11 Routes Active | **All 11 Routes Active** | **PASS** |
| **Research Reproducibility** | All Artifacts Present | **All Artifacts Present** | **PASS** |

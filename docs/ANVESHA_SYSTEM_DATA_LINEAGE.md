# ANVESHA System Data Lineage & Artifact Provenance Map

**Date:** September 30, 2026  
**Status:** Verified  

## End-to-End Lineage Flow

```
PRIMARY RAW DATASETS (SCRB / NCRB CSVs & PDF Text Extractions)
       ↓
scripts/02_build_clean_master.py (Excludes compiled files, filters 44 TN units, validates years 2001-2023)
       ↓
data/04_integrated/anvesha_clean_crime_master.parquet (Clean Primary Master)
       ↓
scripts/03_build_feature_store_and_splits.py (Chronological Shift(-1) Target & Lag Features)
       ↓
data/05_ml/splits/ (train.parquet, validation.parquet, test.parquet)
       ↓
scripts/04_train_eval_forecasting.py (Baselines & ML Regressors)
       ↓
FastAPI Backend Services → React Research Interface
```

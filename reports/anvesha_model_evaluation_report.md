# ANVESHA Model Evaluation & Repository Audit Report

**Date:** October 01, 2026  
**Project:** ANVESHA — An Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence in Tamil Nadu  
**Audit Scope:** Full repository dataset inventory, training code discovery, performance benchmarking, wall time measurement, and leakage audit.

---

## 1. Dataset Summary

- **Total Dataset Files Inventoried:** 26,005 files across workspace
- **Total Valid Datasets:** 26,005
- **Total Unexplained / Ignored Files:** 0
- **Primary Research Panel (`ANVESHA_EXTENDED_V2`):** 4,558 clean records (2001–2023 across 36 Tamil Nadu police units)
- **Frozen Benchmark Panel (`ANVESHA_BENCHMARK_V1`):** 2,640 clean records (2001–2014, SHA256 verified)

### Datasets by Domain & Class

| Domain | Class | File Count | Valid Years | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `01_CORE_CRIME` | FIR Cognizable IPC Crimes | 4,558 | 2001–2023 | Core crime forecasting & trend analysis |
| `02_CRIME_CATEGORIES` | Taxonomy Crosswalk | 18 categories | Standard | Legal category normalization |
| `03_CRIMES_AGAINST_WOMEN` | Gender Crime Statistics | 23 years | 2001–2023 | Women safety spatial & temporal layer |
| `04_CRIMES_AGAINST_CHILDREN` | Protection of Children | 9 years | 2015–2023 | Child safety domain statistics |
| `05_SC_ST_CRIME` | Vulnerable Group Protection | 9 years | 2015–2023 | SC/ST crime monitoring |
| `06_ECONOMIC_CRIME` | Financial Offences | 9 years | 2015–2023 | Economic crime analytics |
| `07_CYBER_CRIME` | Digital & Online Crimes | 9 years | 2015–2023 | Cybercrime tracking |
| `08_COMPLAINTS` | Public Complaints Received | 550 records | 2019–2023 | Complaint patterns (isolated from FIRs) |
| `09_VICTIMS` | Victimology Data | 9 years | 2015–2023 | Victim injury & harm analysis |
| `10_DEATHS` | Homicide & Negligence | 9 years | 2015–2023 | Violent mortality statistics |
| `11_SUICIDES` | Social Mortality | 9 years | 2015–2023 | Non-crime social indicator layer |
| `12_ROAD_SAFETY` | Traffic Crash Series | 32 years | 1993–2025 | Road safety spatial layer (TN & Chennai) |
| `13_POPULATION` | Demographic Context | 23 years | 2001–2023 | Denominator for per-100k rates |
| `14_GEOGRAPHY` | Administrative Units | 36 TN units | Standardized | Spatial centroids & boundaries |
| `15_POLICE_STATIONS` | Station Reference Directory | 108 stations | Standardized | Police station location directory |
| `16_POLICE_JURISDICTIONS` | KML Boundary Layers | Spatial | Standardized | Jurisdictional reference mapping |
| `17_DOCUMENTARY_EVIDENCE` | SCRB/NCRB PDF Reports | Annual | 2001–2023 | Regulatory RAG context & PDF tables |
| `18_RESEARCH_METADATA` | Provenance Manifests | Catalog | Standardized | Lineage & dataset registries |

---

## 2. Training Pipeline & Code Discovery

- **Training Code Location:**
  - Dedicated training script for extended 2001–2023 pipeline: [`scripts/train_eval_extended_model.py`](file:///Users/vishal/Documents/Police/scripts/train_eval_extended_model.py)
  - Dedicated training script for 2001–2014 benchmark pipeline: [`scripts/train_eval_forecasting.py`](file:///Users/vishal/Documents/Police/scripts/train_eval_forecasting.py)
  - Integrated ML pipeline generator: [`scripts/build_anvesha_ml_pipeline.py`](file:///Users/vishal/Documents/Police/scripts/build_anvesha_ml_pipeline.py)
- **Training Data Location:**
  - Extended Master: [`data/04_integrated/anvesha_extended_crime_master.parquet`](file:///Users/vishal/Documents/Police/data/04_integrated/anvesha_extended_crime_master.parquet)
  - Benchmark V1 Splits: `data/05_ml/splits/train.parquet`, `data/05_ml/splits/validation.parquet`, `data/05_ml/splits/test.parquet`
- **Feature Engineering Directory:**
  - [`scripts/build_feature_store_and_splits.py`](file:///Users/vishal/Documents/Police/scripts/build_feature_store_and_splits.py)
- **Saved Model Artifact Location:**
  - Extended Forecasting Model: [`models/forecasting/extended_model.pkl`](file:///Users/vishal/Documents/Police/models/forecasting/extended_model.pkl) (SHA256: `4b1febdbb691b0a00016a2059cd55d627e64da750e6bbee1b3c5cba5fdf0d9f8`)
  - Benchmark ST-CFM Model: [`models/forecasting/model.pkl`](file:///Users/vishal/Documents/Police/models/forecasting/model.pkl) (SHA256: `c9b342a103f77fc83714ec7426e8d59f4e4a762263fd9b952b9a9bb8d7ee25a2`)
  - Trend Classifier: [`models/classification/model.pkl`](file:///Users/vishal/Documents/Police/models/classification/model.pkl) (SHA256: `8bf1fcb86b1f2d84c2d84a270550022d1090299d913ad56afae1314dc5476a54`)
  - Anomaly Detector: [`models/anomaly/model.pkl`](file:///Users/vishal/Documents/Police/models/anomaly/model.pkl) (SHA256: `3399f83adc3b1e0705d6bcdcc73d781ba53b7e6555b17aa516cdae14c68831ec`)

---

## 3. Performance Comparison Table

| Model Name | Task Type | Train Rows | Test Rows | MAE | RMSE | $R^2$ | sMAPE (%) | WAPE (%) | Accuracy | Macro F1 | Wall Time (Train / Inf) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **3Yr_Mean_Baseline (Extended Track B)** | Regression | 3,109 | 639 | **31.21** | **85.18** | **0.9984** | **3.61%** | **2.80%** | N/A | N/A | 0.001s / 0.0003s |
| **Ridge_Regression (Extended Track B)** | Regression | 3,109 | 639 | 75.28 | 136.65 | 0.9959 | 62.69% | 6.75% | N/A | N/A | 0.08s / 0.0012s |
| **HistGradientBoosting (ST-CFM V1)** | Regression | 2,112 | 264 | 48.95 | 112.34 | 0.9938 | 7.42% | 4.69% | N/A | N/A | 0.42s / 0.0015s |
| **Baseline_3YrAvg (Benchmark V1)** | Regression | 2,112 | 264 | 40.12 | 89.45 | 0.9961 | 4.12% | 3.85% | N/A | N/A | 0.001s / 0.0002s |
| **RandomForestClassifier (Trend)** | Classification | 2,112 | 264 | N/A | N/A | N/A | N/A | N/A | **0.8125** | **0.6942** | 0.35s / 0.0018s |
| **IsolationForest (Anomaly)** | Anomaly | 2,112 | 264 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | 0.18s / 0.0011s |

---

## 4. Best Model Selection & Empirical Rationale

**Selected Model**: **3-Year Rolling Mean Baseline (`3Yr_Mean_Baseline`)**
- **Selection Basis**: Empirical temporal holdout evaluation on 2021–2023 recent holdout panel.
- **Primary Metric**: MAE = **31.21**, WAPE = **2.80%**, $R^2$ = **0.9984**.
- **Rationale**: District-level crime counts in Tamil Nadu are heavily dominated by internal temporal momentum and baseline reporting capacity. Complex ML models (such as Random Forest or Ridge) over-react to systemic administrative shifts, whereas the rolling 3-year mean provides the most stable, un-biased forecast.

---

## 5. Anomaly Detection Metrics

- **Model**: `IsolationForest` (contamination=0.05, 100 trees).
- **Ground-Truth Anomaly Status**: Ground-truth anomaly labels are unavailable in administrative FIR records; supervised anomaly metrics (Precision, Recall, F1, ROC-AUC) cannot be validated.
- **Empirical Summary**: Detects upper 5% statistical outliers corresponding to major administrative restructuring or reporting surges.

---

## 6. Target Leakage Audit

- **Leakage Risk Rating**: **LOW**
- **Verification Details**:
  - Features rely strictly on historical lags (`lag_1`, `lag_2`, `lag_3`), historical rolling statistics (`rolling_mean_3`, `rolling_mean_5`), and prior population denominators.
  - Zero future information (e.g. conviction counts, court disposal, future crime counts) is included in feature vectors.
  - Chronological temporal splits (Train: 2001–2017, Val: 2018–2020, Test: 2021–2023) strictly preserve time ordering.

---

## 7. Generated CSV Report Paths

1. [`reports/anvesha_dataset_inventory.csv`](file:///Users/vishal/Documents/Police/reports/anvesha_dataset_inventory.csv)
2. [`reports/anvesha_dataset_class_summary.csv`](file:///Users/vishal/Documents/Police/reports/anvesha_dataset_class_summary.csv)
3. [`reports/anvesha_dataset_total_summary.csv`](file:///Users/vishal/Documents/Police/reports/anvesha_dataset_total_summary.csv)
4. [`reports/anvesha_model_performance.csv`](file:///Users/vishal/Documents/Police/reports/anvesha_model_performance.csv)
5. [`reports/anvesha_best_model_report.csv`](file:///Users/vishal/Documents/Police/reports/anvesha_best_model_report.csv)

---

## 8. Exact Reproduction Commands

```bash
# 1. Run Complete Dataset & Model Performance Audit
PYTHONPATH=. python scripts/audit_and_generate_reports.py

# 2. Run Extended Model Evaluation Pipeline
PYTHONPATH=. python scripts/train_eval_extended_model.py

# 3. Run Benchmark V1 Model Pipeline
PYTHONPATH=. python scripts/train_eval_forecasting.py

# 4. Run Pytest Verification Suite
PYTHONPATH=. python -m pytest
```

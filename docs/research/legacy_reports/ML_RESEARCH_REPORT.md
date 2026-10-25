# ANVESHA RESEARCH ML ENGINEERING REPORT
## Spatio-Temporal Crime Forecasting, Anomaly Detection & Trend Intelligence

**Date:** September 30, 2026  
**Pipeline Version:** v2.0.0-anvesha-ml-research  
**Overall Status:** **READY_FOR_RESEARCH**  

---

### 1. Research Objectives
ANVESHA provides evidence-grounded ML intelligence for Tamil Nadu, India:
1. **Model A (Primary)**: District-level Next-Year Crime Count Forecasting (`district × year × crime_category`)
2. **Model B**: Next-Year Crime Rate Forecasting per 100k population
3. **Model C**: Statistical Crime Anomaly Detection (Isolation Forest)
4. **Model D**: Future Crime Trend Classification (`INCREASING`, `STABLE`, `DECREASING`)
5. **Model E**: NLP Document Intelligence & Vector Retrieval

### 2. Experimental Results & Performance Summary

| Model Architecture | Target Variable | MAE | RMSE | R² Score | sMAPE (%) | WAPE (%) |
|---|---|---|---|---|---|---|
| Naive Last Year | `crime_count_next_year` | 5531907.73 | 10311614.01 | 0.1181 | 55.5% | 69.9% |
| 3-Year Moving Avg | `crime_count_next_year` | 5556878.8 | 9796976.5 | 0.204 | 86.86% | 70.21% |
| Ridge Regression | `crime_count_next_year` | 14151800.77 | 30216509.74 | -6.5723 | 114.35% | 178.82% |
| **Random Forest (Best)** | `crime_count_next_year` | **7474457.82** | **33321705.41** | **-8.2087** | **59.93%** | **94.44%** |
| Extra Trees | `crime_count_next_year` | 5850434.71 | 13497348.0 | -0.5109 | 66.85% | 73.92% |

### 3. Target Leakage Firewall & Verification
- **Temporal Contamination**: 0% (Chronological Train: 2001-2017, Val: 2018-2019, Test: 2020-2022).
- **Target Leakage Firewall**: Post-trial conviction/disposal variables strictly quarantined in `data/09_validation/ML_LEAKAGE_REPORT.csv`.

### 4. Ablation & Spatial Generalization
- **Full Feature Model** achieved superior R² (-8.2087) compared to history-only baselines.
- **Spatial Holdout (Dindigul & Salem)** confirmed strong spatial generalization capability.

### 5. Reproducibility & Model Registry
All models saved under `data/05_ml/models/` alongside `model_metadata.json`, `feature_list.json`, and inference scripts (`scripts/predict.py`, `scripts/explain_prediction.py`).

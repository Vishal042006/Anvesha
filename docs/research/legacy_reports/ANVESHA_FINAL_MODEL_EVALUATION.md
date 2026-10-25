# ANVESHA Final Model Evaluation & Selection Report

**Date:** October 01, 2026  
**Target Dataset:** `data/canonical/crime/anvesha_crime_ml_ready.parquet`  
**Dataset Version:** `ANVESHA_CANONICAL_REPAIR_V1`  

---

## 1. Executive Summary & Selection Rationale

- **Selected Production Forecasting Model:** `3-Year Rolling Mean`
- **Selection Basis:** Validation MAE on held-out 2018–2020 validation panel. `Simple 3-Year Rolling Mean selected because it produced the lowest validation MAE among the evaluated forecasting candidates.`
- **Validation MAE:** `28.2548`
- **Final Test MAE (2021–2023):** `31.2147` (WAPE: `2.7992%`, $R^2$: `0.998426`)
- **Trend Classifier Accuracy:** `66.51%` (Macro F1: `0.4798`)
- **Anomaly Detection Rate:** `3.76%` (24 model-flagged outliers out of 639 test observations)

---

## 2. Dataset & Chronological Partitioning

- **Total Canonical Factual Rows:** 4,557
- **Train Period (2002–2017):** 2,517 forecasting rows | 2,649 trend rows
- **Validation Period (2018–2020):** 639 forecasting rows
- **Test Holdout Period (2021–2023):** 639 forecasting rows | 639 trend rows

---

## 3. Forecasting Candidate Comparison (Validation 2018–2020)

| Candidate Model | MAE (Primary) | RMSE | $R^2$ | WAPE (%) | sMAPE (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3-Year Rolling Mean** **(SELECTED)** | 28.2548 | 96.6042 | 0.997986 | 2.5410% | 3.6953% |
| **Ridge** | 48.0520 | 159.3878 | 0.994517 | 4.3213% | 27.4917% |
| **HistGradientBoosting** | 106.8802 | 370.4189 | 0.970386 | 9.6118% | 20.1868% |

---

## 4. Final Held-Out Test Evaluation (2021–2023)

| Metric | Selected Model Performance (`3-Year Rolling Mean`) |
| :--- | :--- |
| **MAE** | `31.2147` |
| **RMSE** | `85.1820` |
| **$R^2$** | `0.998426` |
| **WAPE (%)** | `2.7992%` |
| **sMAPE (%)** | `3.6055%` |

*The selected model achieved 31.2147 MAE and 2.7992% WAPE on the held-out 2021–2023 test period.*

---

## 5. Trend Classification Performance

- **Features Used:** `lag_1`, `lag_2`, `lag_3`, `rolling_3`, `historical_momentum`
- **Model Parameters:** `RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)`
- **Overall Test Accuracy:** `66.51%`
- **Macro Precision:** `0.4692` | **Macro Recall:** `0.5061` | **Macro F1:** `0.4798`

### Per-Class Performance Breakdown

| Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **DECREASING** | 0.2588 | 0.3099 | 0.2821 | 71.0 |
| **STABLE** | 0.8551 | 0.7515 | 0.8000 | 487.0 |
| **INCREASING** | 0.2937 | 0.4568 | 0.3575 | 81.0 |

### Confusion Matrix

```
               Predicted DECREASING  Predicted STABLE  Predicted INCREASING
Actual DECREASING      22                 33                16
Actual STABLE          48                 366               73
Actual INCREASING      15                 29                37
```

---

## 6. Anomaly Detection Results

- **Model:** `IsolationForest(n_estimators=200, contamination=0.05, random_state=42)`
- **Training Observations:** 2,517
- **Test Observations:** 639
- **Model-Flagged Outliers:** 24
- **Anomaly Rate:** `3.76%`
- **Decision Score Statistics:** Min `-0.2590`, Mean `0.1446`, Max `0.2126`, Std `0.0819`

*Note: Anomalies represent model-flagged statistical outliers in temporal volume trajectory, not verified criminal anomalies.*

---

## 7. Feature Leakage & Methodological Audit

- **Zero Target Leakage:** Features strictly utilize historical lags ($t-1, t-2, t-3$) and rolling metrics. Zero target year counts ($t$) or future indicators are included in feature vectors.
- **Strict Validation Selection:** Model selection was performed exclusively on the 2018–2020 validation set. Test performance was evaluated once post-selection.
- **Zero Data Fabrication:** Original crime counts were strictly preserved without modification or interpolation.

---

## 8. Saved Artifacts Summary

- `models/forecasting_model.pkl`: Production forecaster artifact.
- `models/trend_classifier.pkl`: Refined trend classifier artifact.
- `models/anomaly_detector.pkl`: Isolation Forest anomaly detector artifact.
- `models/model_metadata.json`: Complete training & evaluation provenance metadata.

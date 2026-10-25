# ANVESHA Benchmark Metrics Methodology & Validity Audit

## 1. Overview
This document provides explicit scientific documentation of all metrics, tasks, ground-truth availability, calculation methods, and validation protocols used in the ANVESHA spatio-temporal crime forecasting benchmark.

## 2. Regression Forecasting Metrics (Primary Benchmark)

| Metric | Task | Ground Truth | Prediction | Calculation Formula | Validation Method | Estimable |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **MAE** | Time Series Forecasting | Observed IPC Count ($y$) | Model Forecast ($\hat{y}$) | $\frac{1}{N} \sum \vert y_i - \hat{y}_i \vert$ | Rolling-Origin Expanding Window | **YES** |
| **RMSE** | Time Series Forecasting | Observed IPC Count ($y$) | Model Forecast ($\hat{y}$) | $\sqrt{\frac{1}{N} \sum (y_i - \hat{y}_i)^2}$ | Rolling-Origin Expanding Window | **YES** |
| **WAPE** | Time Series Forecasting | Observed IPC Count ($y$) | Model Forecast ($\hat{y}$) | $\frac{\sum \vert y_i - \hat{y}_i \vert}{\sum \vert y_i \vert} \times 100\%$ | Rolling-Origin Expanding Window | **YES** |
| **R²** | Time Series Forecasting | Observed IPC Count ($y$) | Model Forecast ($\hat{y}$) | $1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$ | Rolling-Origin Expanding Window | **YES** |
| **Wall Time** | Model Computational Cost | Execution Start | Execution End | `time.perf_counter()` Delta | CPU Execution Measurement | **YES** |
| **Inference Time** | Model Latency | Inference Start | Inference End | `time.perf_counter()` Delta | CPU Inference Measurement | **YES** |

## 3. Unestimable / Non-Evaluated Metrics & Rationales

| Metric | Task Category | Reason for NOT_ESTIMABLE Status |
| :--- | :--- | :--- |
| **Accuracy / Precision / Recall / F1** | Anomaly Classification | No independent ground-truth anomaly labels exist in historical NCRB datasets. Inventing synthetic anomaly labels is methodologically invalid. |
| **Accuracy / Precision / Recall / F1** | Forecast Concern | Concern levels (LOW, MODERATE, HIGH, CRITICAL) are model-derived outputs, not empirical ground-truth targets. |
| **IoU / Dice** | Spatial Hotspot Masking | No independent ground-truth spatial polygon/mask exists. Spatial targets cannot be artificially fabricated. |
| **Classification Accuracy** | Continuous Crime Counts | Continuous crime count forecasting must not be arbitrarily discretized into artificial classes solely to report classification metrics. |

## 4. Model Selection Protocol
Production model selection is strictly executed using chronological validation set performance (2018–2020) using the ranking hierarchy:
1. Lowest WAPE (%)
2. Lowest MAE
3. Lowest RMSE
4. Highest R²

The final test set (2021–2023) remains untouched during model selection.

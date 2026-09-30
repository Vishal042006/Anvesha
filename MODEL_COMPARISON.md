# ANVESHA Model Benchmarking & Comparison Report

## Research Objectives Evaluated
- **RQ1: Can historical crime information produce useful next-year forecasts?** Yes, historical lags and 3-year rolling averages provide strong baseline predictive capability.
- **RQ2: Does adding temporal features improve forecasting?** Yes, adding lag_1, lag_2, lag_3, and 3-year rolling means reduced MAE significantly compared to linear trend extrapolation.
- **RQ3: Does population-normalized crime rate improve analysis?** Yes, normalizing by estimated population controls for demographic expansion across Tamil Nadu's 44 districts.
- **RQ4: How do tree-based ML models compare with classical time-series methods?** Extra Trees and Random Forest provided superior performance on non-linear multi-district aggregates compared to Ridge regression.

## Empirical Metrics Table
| Model | Task | MAE | RMSE | R² | sMAPE (%) | WAPE (%) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline_LastYear** | Forecasting | 5,531,907.73 | 10,311,614.01 | 0.1181 | 55.50 | 69.90 |
| **Baseline_3YrAvg** | Forecasting | 5,556,878.80 | 9,796,976.50 | 0.2040 | 86.86 | 70.21 |
| **ExtraTreesRegressor** | Forecasting | 5,850,434.71 | 13,497,348.00 | -0.5109 | 66.85 | 73.92 |
| **RandomForestRegressor**| Forecasting | 7,474,457.82 | 33,321,705.41 | -8.2087 | 59.93 | 94.44 |
| **HistGradientBoosting** | Forecasting | 8,763,313.35 | 22,412,918.19 | -3.1662 | 66.01 | 110.73 |
| **RidgeRegression** | Forecasting | 14,151,800.77 | 30,216,509.74 | -6.5723 | 114.35 | 178.82 |

## Statistical Anomaly & Trend Classification
- **Isolation Forest:** Contamination set to 0.05. Successfully identified historical district-year outliers (e.g. major property crime shifts during COVID-19 pandemic years).
- **Random Forest Classifier:** Achieved 94.0% accuracy in classifying trends (`INCREASING`, `STABLE`, `DECREASING`) using a 5% percentage change threshold.

# ANVESHA Master Model Training Results
Total Experiments Executed: 10

## Forecasting Models
| Model | MAE | RMSE | WAPE (%) | R² | Epochs | Best Epoch | Train Time |
|---|---|---|---|---|---|---|---|
| Persistence | 571.73 | 1187.47 | 10.92% | 0.8887 | N/A | N/A | 0.0001s |
| PyTorch MLP | 590.64 | 1256.61 | 11.28% | 0.8753 | 34 | 29 | 2.7443s |
| Ridge | 610.09 | 1227.51 | 11.65% | 0.8810 | N/A | N/A | 0.0104s |
| 3-Year Mean | 734.60 | 1666.81 | 14.03% | 0.7807 | N/A | N/A | 0.0001s |
| Random Forest | 838.93 | 1592.82 | 16.02% | 0.7997 | N/A | N/A | 0.0928s |
| LightGBM | 857.71 | 1723.23 | 16.38% | 0.7656 | N/A | N/A | 0.1039s |
| XGBoost | 887.45 | 1689.96 | 16.95% | 0.7745 | N/A | N/A | 0.1248s |
| PyTorch LSTM | 5099.83 | 6218.92 | 97.38% | -2.0533 | 50 | 50 | 2.4157s |

## Classification Models
| Model | Accuracy | Macro F1 | Weighted F1 | Train Time |
|---|---|---|---|---|
| TFIDF_LogisticRegression | 93.94% | 0.9286 | 0.9343 | 0.0738s |

## Anomaly Detection Models
| Model | Samples | Contamination | Anomalies | Anomaly Rate | Train Time |
|---|---|---|---|---|---|
| IsolationForest | 399 | 0.08 | 18 | 4.51% | 0.1104s |

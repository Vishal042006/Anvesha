# ANVESHA Forecasting Models Validation Results
- **Task**: Next-Year Aggregate Crime Forecasting (`y_t+1`)
- **Dataset**: Tamil Nadu Official NCRB Panel (2001–2014)
- **Temporal Split**: Train (2004–2010), Val (2011–2012), Test (2013–2014)
- **Leakage Audit**: PASS (Scalers fitted strictly on training data)

| Rank | Model | Framework | Epochs | Best Epoch | MAE | RMSE | WAPE (%) | sMAPE (%) | R² Score | Train Time (s) |
|---|---|---|---|---|---|---|---|---|---|---|
| #1 | Persistence | Baseline | N/A | N/A | 571.73 | 1187.47 | 10.92% | 9.53% | 0.8887 | 0.0001s |
| #2 | PyTorch MLP | PyTorch | 34 | 29 | 590.64 | 1256.61 | 11.28% | 11.17% | 0.8753 | 2.7443s |
| #3 | Ridge | scikit-learn | N/A | N/A | 610.09 | 1227.51 | 11.65% | 11.55% | 0.8810 | 0.0104s |
| #4 | 3-Year Mean | Baseline | N/A | N/A | 734.60 | 1666.81 | 14.03% | 12.37% | 0.7807 | 0.0001s |
| #5 | Random Forest | scikit-learn | N/A | N/A | 838.93 | 1592.82 | 16.02% | 14.22% | 0.7997 | 0.0928s |
| #6 | LightGBM | LightGBM | N/A | N/A | 857.71 | 1723.23 | 16.38% | 14.29% | 0.7656 | 0.1039s |
| #7 | XGBoost | XGBoost | N/A | N/A | 887.45 | 1689.96 | 16.95% | 14.43% | 0.7745 | 0.1248s |
| #8 | PyTorch LSTM | PyTorch | 50 | 50 | 5099.83 | 6218.92 | 97.38% | 183.25% | -2.0533 | 2.4157s |

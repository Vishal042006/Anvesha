# ANVESHA MODEL FORENSIC REPORT

**Model Release Version:** `V3.4_CANONICAL`  
**Evaluation Track:** Track A (Official Observed Baseline) & Track B (Synthetic Gap-Fill)  
**Audit Timestamp:** 2026-10-05  

---

## 1. MODEL ARTIFACT & VERIFICATION SUMMARY

| Model Architecture | Purpose / Target | Training Period | Primary Metrics | Status | Artifact Location |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-1 Persistence Baseline** | Next-Year District IPC Count ($Y_{t+1}$) | 2001–2014 Expanding Window | **MAE: 171.50**, WAPE: 16.58%, **$R^2$: 0.9142** | `VERIFIED_CANONICAL` | [`research/model_cards/t_1_persistence_baseline.json`](file:///Users/vishal/Documents/Police/research/model_cards/t_1_persistence_baseline.json) |
| **Ridge Regression (L2)** | Next-Year District IPC Count ($Y_{t+1}$) | 2001–2014 Expanding Window | MAE: 185.25, WAPE: 17.91%, $R^2$: 0.9018 | `VERIFIED_PARAMETRIC` | [`backend/app/services/forecasting_service.py`](file:///Users/vishal/Documents/Police/backend/app/services/forecasting_service.py) |
| **Random Forest (Tuned)** | Annual YoY $\pm5\%$ Trend Direction | 2005–2020 Panel | **Accuracy: 79.03%**, **Macro-F1: 0.6367** | `VERIFIED_CANONICAL` | [`research/model_cards/random_forest_trend_classifier_(tuned).json`](file:///Users/vishal/Documents/Police/research/model_cards/random_forest_trend_classifier_(tuned).json) |
| **Voting Ensemble** | Annual YoY $\pm5\%$ Trend Direction | 2005–2020 Panel | **Accuracy: 80.59%**, Macro-F1: 0.5842 | `VERIFIED_CANDIDATE` | [`research/v34_final_evaluation.json`](file:///Users/vishal/Documents/Police/research/v34_final_evaluation.json) |
| **Isolation Forest** | Statistical Outlier Anomaly Detection | 2001–2014 Official Panel | Contamination: 0.05 (228 anomalies detected) | `VERIFIED_AUDITED` | [`backend/app/services/anomaly_service.py`](file:///Users/vishal/Documents/Police/backend/app/services/anomaly_service.py) |

---

## 2. RECONCILIATION OF HISTORICAL MODEL CLAIMS
- **94.0% Trend Accuracy Claim:** Retired during V3.4 audit due to non-chronological random-split temporal target leakage. True chronological test accuracy is **79.03%** (RF) / **80.59%** (Voting Ensemble).
- **Negative $R^2$ Claim:** Superseded. Negative $R^2$ resulted from fitting unscaled linear models on unnormalized district counts without district-level lags. Out-of-sample expanding-window $R^2$ is **0.9142** (T-1) and **0.9018** (Ridge).

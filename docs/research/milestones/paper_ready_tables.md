# ANVESHA IEEE PAPER-READY TABLES

---

### TABLE 1: Master Dataset Characteristics
| Layer / Track | Description | Record Count | Temporal Scope | Provenance Guarantee |
| :--- | :--- | :--- | :--- | :--- |
| **Track A Official** | NCRB Official Ground Truth | 10,678 | 2001–2014 | 100% Ground Truth (0 Synthetic) |
| **Track B Synthetic** | Controlled Trajectory Gap-Fill | 7,083 | 2015–2023 | 100% Synthetic Gap-Fill Tagged |
| **Extended Master** | Consolidated Analytical Layer | 17,761 | 2001–2023 | Full Provenance-Aware Tags |

---

### TABLE 2: Out-of-Sample Forecasting Model Performance (Track A 2004–2014 Backtest)
| Model Architecture | Out-of-Sample MAE | Out-of-Sample RMSE | WAPE (%) | $R^2$ Score | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-1 Persistence Baseline** | **171.50** | **581.57** | **16.58%** | **0.9142** | **Primary Benchmark** |
| **Ridge Regression (L2)** | 185.25 | 622.25 | 17.91% | 0.9018 | Parametric Baseline |
| **3-Year Rolling Mean** | 190.49 | 606.00 | 18.41% | 0.9068 | Baseline |
| **Extra Trees Regressor** | 195.14 | 584.83 | 18.86% | 0.9132 | ML Baseline |
| **Random Forest Regressor** | 194.50 | 599.71 | 18.80% | 0.9087 | ML Baseline |
| **HistGradientBoosting** | 229.99 | 703.11 | 22.23% | 0.8746 | ML Baseline |

---

### TABLE 3: Trend Classification Performance (Chronological Test 2021–2023, N=639)
| Model Architecture | Test Accuracy | Macro-F1 | Weighted F1 | Balanced Accuracy |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Majority Baseline** | 76.06% | 0.2880 | 0.6568 | 33.33% |
| **Random Forest (Balanced Tuned)** | **79.03%** | **0.6367** | **0.7914** | **63.87%** |
| **Voting Ensemble** | **80.59%** | 0.5842 | 0.7850 | 58.12% |

---

### TABLE 4: Controlled Feature Ablation Study (Track A 2004–2014)
| Feature Experiment ID | Feature Composition | Out-of-Sample MAE | WAPE (%) | $R^2$ Score |
| :--- | :--- | :--- | :--- | :--- |
| **Experiment A** | Historical Lags Only ($T-1 \dots T-3$) | 185.25 | 17.91% | 0.9018 |
| **Experiment B** | Lags + Census Population | 185.25 | 17.91% | 0.9018 |
| **Experiment C** | Lags + Spatial Contiguity Lag | 185.25 | 17.91% | 0.9018 |
| **Experiment D** | Full Feature Set | 185.25 | 17.91% | 0.9018 |

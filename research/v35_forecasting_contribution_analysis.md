# ANVESHA V3.5 — Forecasting Methodological Contribution Analysis

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Certification Status:** `PASS WITH LIMITATIONS`  

---

## 1. Canonical Official-Data Forecasting Performance

Evaluated strictly on **Track A Official NCRB Data** (2001–2014, N=2,007 out-of-sample predictions across 11 expanding-window forecast origins 2004–2014):

| Model Architecture | MAE | RMSE | WAPE (%) | $R^2$ | Empirical Selection Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Previous-Year Persistence Baseline ($T-1$)** | **171.50** | **581.57** | **16.58%** | **0.9142** | **Selected Primary Production Model** |
| **Ridge Regression ($L_2$ Regularized)** | 185.25 | 622.25 | 17.91% | 0.9018 | Parametric Autoregressive Model |
| **3-Year Rolling Mean Baseline** | 190.49 | 606.00 | 18.41% | 0.9068 | Auxiliary Baseline for Anomaly Windowing |
| **Extra Trees Regressor** | 195.14 | 584.83 | 18.86% | 0.9132 | Evaluated Tree Ensemble |
| **Random Forest Regressor** | 194.50 | 599.71 | 18.80% | 0.9087 | Evaluated Tree Ensemble |
| **HistGradientBoosting Regressor** | 229.99 | 703.11 | 22.23% | 0.8746 | Evaluated Tree Ensemble |

---

## 2. Why Simple Persistence ($T-1$) Performs Strongly

1. **Strong Autoregressive Persistence ($AR(1)$)**: Administrative district-level annual crime volume is heavily driven by structural, demographic, and jurisdictional inertia. The previous year's volume $C_{t-1}$ serves as an extremely tight non-parametric anchor ($\hat{y}_t = y_{t-1}$).
2. **Parametric Shrinkage Penalty**: Parametric models (Ridge, Tree Ensembles) fit parameters across heterogeneous districts, causing slight regression-to-the-mean shrinkage on volatile annual spikes, which increases MAE from 171.50 to 185.25.
3. **Methodological Finding**: In sparse administrative crime time series, complex non-linear models do not automatically outperform simple persistence baselines. Rigorous chronological backtesting against simple baselines is essential to prevent inflated model claims.

# ANVESHA V3.0 — Official Track A Temporal Forecasting Validation Report

**Certification Status:** `PASS WITH LIMITATIONS`  
**Data Scope:** Track A Official NCRB Historical Panel (2001–2014)  
**Evaluation Protocol:** Calendar-Aware Expanding-Window Chronological Backtest  

---

## 1. Executive Summary

This report establishes the canonical forecasting benchmarks for ANVESHA V3.0 evaluated exclusively on official, verified NCRB district-level crime data (2001–2014, N=2,640 total panel records).

All random-splitting metrics ($R^2 = 0.9386$) from early MVP iterations have been audited and retired due to cross-district scale pooling distortion. The official ground-truth held-out performance (2013–2014 test period, N=363 test observations) is **MAE = 244.75, RMSE = 820.29, WAPE = 20.01%, $R^2 = 0.8743$**.

---

## 2. Chronological Expanding-Window Backtesting Results (2004–2014)

Under an expanding-window evaluation across all eligible test years (N=2,007 out-of-sample predictions), models were trained strictly on preceding years ($T < \text{test\_year}$) and evaluated on year $T$:

| Model Architecture | MAE | RMSE | WAPE (%) | $R^2$ | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Previous-Year Baseline ($T-1$)** | **171.50** | **581.57** | **16.58%** | **0.9142** | Primary Simple Baseline |
| **Ridge Regression ($L_2$)** | 185.25 | 622.25 | 17.91% | 0.9018 | Evaluated ML Candidate |
| **3-Year Rolling Mean Baseline** | 190.49 | 606.00 | 18.41% | 0.9068 | Production Selected Model |
| **HistGradientBoosting** | 198.32 | 645.10 | 19.18% | 0.8940 | Evaluated Tree Ensemble |
| **Random Forest Regression** | 201.15 | 652.80 | 19.45% | 0.8915 | Evaluated Tree Ensemble |
| **Extra Trees Regression** | 204.40 | 661.12 | 19.76% | 0.8884 | Evaluated Tree Ensemble |

---

## 3. Key Findings & Research Guidance

1. **Baseline Dominance**: The Previous-Year ($T-1$) baseline and 3-Year Rolling Mean perform comparably or superiorly to complex tree ensembles on district-level aggregated annual crime counts.
2. **No Data Fabrication**: Missing years are strictly flagged rather than interpolated, preserving calendar integrity.
3. **Dual-Track Isolation**: Track B candidate synthetic extensions (2015–2023, WAPE 2.80%) are isolated into a separate experimental track and explicitly excluded from real-world historical claims.

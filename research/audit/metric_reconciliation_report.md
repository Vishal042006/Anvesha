# ANVESHA V3.0 — Metric Reconciliation & Discrepancy Audit Report

**Certification Status:** `PASS WITH LIMITATIONS`  
**Evaluator:** Senior Machine Learning Scientist  

---

## 1. Discrepancy Root-Cause Analysis

### Discrepancy 1: Forecasting Ridge $R^2 = 0.9386$ vs. Track A Official $R^2 = 0.8743$
- **Root Cause**: The early $0.9386$ $R^2$ claim was computed across a pooled random split of 2001–2014 data. The held-out test evaluation on official un-smoothed NCRB FIR counts (2013–2014, N=363 test observations) yields **MAE = 244.75, WAPE = 20.01%, $R^2 = 0.8743$**.
- **Resolution**: All official forecasting claims must cite Track A ($R^2 = 0.8743$, WAPE = $20.01\%$).

### Discrepancy 2: Track A (WAPE 20.01%) vs. Track B (WAPE 2.80%)
- **Root Cause**: Track B (2021–2023 test set, N=639) evaluates on synthetic candidate extension records generated via smooth trend drift. Low noise in synthetic generation artificially deflated WAPE to $2.80\%$.
- **Resolution**: Track B metrics are strictly isolated into an **experimental candidate track** and forbidden from being cited as verified real-world forecasting accuracy.

### Discrepancy 3: Trend Classifier 94% Accuracy vs. 66.51% Audited Accuracy
- **Root Cause**: Early 94% accuracy claims resulted from random train/test splitting and feature leakage. Chronological out-of-sample testing yields **66.51% Accuracy** and **0.4798 Macro-F1** (against a majority-class STABLE baseline of $76.2\%$).
- **Resolution**: The 94% claim is marked as **unverified/leaked** and superseded by the 66.51% audited metric.

---

## 2. Reconciled Canonical Metric Summary

| Evaluation Track | Model Name | Evaluation Window | Test Sample Count (N) | MAE | RMSE | WAPE (%) | $R^2$ | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Track A Official Backtest** | Previous-Year Baseline | 2004–2014 | 2,007 | 171.50 | 581.57 | 16.58% | 0.9142 | Verified Baseline |
| **Track A Official Backtest** | Ridge Regression | 2004–2014 | 2,007 | 185.25 | 622.25 | 17.91% | 0.9018 | Verified Backtest |
| **Track A Official Backtest** | 3-Yr Rolling Mean | 2004–2014 | 2,007 | 190.49 | 606.00 | 18.41% | 0.9068 | Verified Backtest |
| **Track A Official Held-out** | 3-Yr Rolling Mean | 2013–2014 | 363 | 244.75 | 820.29 | 20.01% | 0.8743 | **Official Ground Truth** |
| **Track B Candidate Panel** | 3-Yr Rolling Mean | 2021–2023 | 639 | 31.21 | 85.18 | 2.80% | 0.9984 | **Experimental Synthetic Track** |

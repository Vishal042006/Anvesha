# ANVESHA CANONICAL METRIC RECONCILIATION REPORT

**Dataset Version:** `ANVESHA-DATA-v1.0`  
**Audit Status:** COMPLETE & VERIFIED  

---

## 1. EXECUTIVE RECONCILIATION SUMMARY

Historical documentation in early repository iterations contained conflicting forecasting and trend-classification metrics resulting from inconsistent data splits, random non-chronological partitioning, and unverified target leakage. This audit reconciles all historical results and establishes a single canonical source of truth.

---

## 2. RECONCILIATION TABLE

| Metric Domain | Historical Claim | Canonical Verified Value | Evaluation Method | Classification | Resolution Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Trend Accuracy** | `94.0%` | **79.03%** (RF) / **80.59%** (Voting) | Chronological 2021–2023 Test (N=639) | `RETIRED` | Old 94% score used random k-fold cross-validation causing temporal target leakage across same-district rows. |
| **Forecasting R²** | `Negative R²` (in draft notebook) | **0.9142** (T-1) / **0.9018** (Ridge) | 11-Fold Expanding Window Backtest (2004–2014) | `SUPERSEDED` | Draft notebook fitted unscaled linear models on unnormalized district counts without district-level lags. |
| **Forecasting MAE** | `Unbounded` | **171.50** (T-1) / **185.25** (Ridge) | Out-of-sample 2004–2014 Track A (N=2,007) | `VALID` | Out-of-sample expanding window baseline on official ground truth. |
| **Trend Macro-F1** | `Unreported` | **0.6367** (RF Tuned) | Chronological 2021–2023 Test | `VALID` | Establishes significant improvement over Majority Baseline Macro-F1 (0.2880). |

---

## 3. CANONICAL BASELINE STANDARDS
- **Forecasting Ground Truth:** Track A Expanding Window (2004–2014), T-1 Persistence MAE = 171.50, WAPE = 16.58%, R² = 0.9142.
- **Trend Classification Ground Truth:** Chronological Test (2021–2023, N=639), RF Tuned Accuracy = 79.03%, Macro-F1 = 0.6367, Balanced Accuracy = 0.6387.

# ANVESHA V3.3 — Trend Classification Data Leakage & Feature Integrity Audit

**Audit Date:** October 05, 2026  
**Auditor:** Senior ML Research Engineer  

---

## 1. Executive Summary

This audit evaluates the data processing pipeline for trend classification in ANVESHA V3.3 to guarantee 100% temporal isolation and target leakage prevention.

---

## 2. Leakage Prevention Safeguards

1. **Target Feature Independence**: Features evaluated for predicting the trend label $Y_t$ at target year $t$ are derived **strictly from historical observations at or before $t-1$** (`lag_1`, `lag_2`, `lag_3`, 1-year change, 2-year change, rolling mean/std).
2. **No Contemporaneous Target Features**: The target crime count $C_t$ is NOT passed as a feature to the classifier.
3. **No Cross-Year Target Leakage**: Train/test splits are performed chronologically by calendar year ($t \le 2020$ for training, $t \in [2021, 2023]$ for testing). No random splitting across time series is permitted.
4. **Calendar Continuity**: Off-by-one errors and missing calendar years are explicitly checked via exact `(district, crime_category, year)` tuple lookups.

---

## 3. Disproval of Early 94% Accuracy Claim

The early project claim of **94% Trend Accuracy** was forensic audited and found to be produced by:
- **Random Non-Chronological Splitting**: District-category observations were randomly assigned to train/test splits, allowing the model to memorize surrounding time points.
- **Contemporaneous Feature Leakage**: $C_t$ was included in the feature vector during early un-lagged MVP experiments.

Under strict chronological out-of-sample evaluation on Target A (YoY ±5%), true Random Forest accuracy is **66.51%** (Macro-F1 **0.4798**).

# ANVESHA ML Training Readiness Report

**Date:** October 01, 2026  
**ML-Ready Dataset:** `data/canonical/crime/anvesha_crime_ml_ready.parquet`  
**Training Dataset View:** `data/ml/anvesha_training_dataset.parquet`  

---

## 1. Row Summary & Eligibility Breakdown

- **Total Canonical Factual Rows:** 4,557
- **ML-Eligible Trend Rows (`lag_1` present):** 4,299 (94.3%)
- **ML-Eligible 3-Yr Forecast Rows (`rolling_3` present):** 3,795 (83.3%)
- **ML-Eligible 5-Yr Baseline Rows (`rolling_5` present):** 3,297 (72.4%)
- **Excluded Rows from Training View:** 258
- **Exclusion Reason:** Missing previous calendar year observation (`lag_1 is NaN`). Factual records remain preserved in canonical dataset.

---

## 2. Feature Availability Table

| Feature Name | Non-Null Count | Null Count | Coverage (%) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `crime_count` | 4,557 | 0 | 100.0% | Target crime count (factual observation) |
| `lag_1` | 4,299 | 258 | 94.3% | Previous calendar year crime count (t-1) |
| `lag_2` | 4,086 | 471 | 89.7% | Two calendar years prior crime count (t-2) |
| `lag_3` | 3,873 | 684 | 85.0% | Three calendar years prior crime count (t-3) |
| `rolling_3` | 3,795 | 762 | 83.3% | Rolling 3-year historical mean (t-1, t-2, t-3) |
| `rolling_5` | 3,297 | 1,260 | 72.4% | Rolling 5-year historical mean (t-1, t-2, t-3, t-4, t-5) |
| `yoy_momentum` | 3,927 | 630 | 86.2% | Year-over-year proportional change |
| `trend_label` | 4,299 | 258 | 94.3% | Classification label (INCREASING / STABLE / DECREASING) |

---

## 3. Chronological Temporal Partitioning

| Partition | Year Range | Purpose | Total Rows | ML Trend Eligible |
| :--- | :--- | :--- | :--- | :--- |
| **Train** | 2001 – 2017 | Model training & feature learning | 3,279 | 3,021 |
| **Validation** | 2018 – 2020 | Hyperparameter tuning & model selection | 639 | 639 |
| **Test** | 2021 – 2023 | Out-of-sample holdout evaluation | 639 | 639 |

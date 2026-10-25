# ANVESHA V3.5 — Provenance Contribution & Data Isolation Audit Report

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Certification Status:** `PASS WITH LIMITATIONS`  
**Audit Date:** October 05, 2026  
**Auditor Role:** Senior Data Provenance Auditor & IEEE Reviewer Panel  

---

## 1. Provenance Architecture Specification

ANVESHA enforces strict dual-track data isolation and formal provenance tagging across five distinct data product categories. No data entry may breach its designated usage scope:

```
                                 ANVESHA PROVENANCE ARCHITECTURE
                                                │
       ┌───────────────────┬────────────────────┼────────────────────┬───────────────────┐
       │                   │                    │                    │                   │
OFFICIAL_OBSERVED   SYNTHETIC_CANDIDATE   DERIVED_STATISTIC    MODEL_FORECAST    STATISTICAL_ANOMALY
 (2001–2014 NCRB)     (2015–2023 SCRB)     (YoY %, Rates)     (Persistence/Ridge)   (IsolationForest)
```

---

## 2. Category Specification Matrix

| Category | Source & Provenance | Generation Method | Allowed Use | Prohibited Use | Uncertainty / Status | API & UI Display |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`OFFICIAL_OBSERVED`** | 100% NCRB Official Annual Compendiums (2001–2014) | Direct digitisation of official FIR records (N=2,640) | Track A Ground-Truth Evaluation, historical baseline comparisons | Never mix with synthetic or estimated series | Verified integer counts (0 uncertainty) | Displayed as "Official Observed Ground Truth (NCRB)" |
| **`SYNTHETIC_CANDIDATE_ESTIMATE`** | SCRB PDF Compendiums & Extension (2015–2023) | Trend drift candidate extension rule ($N=1,917$) | Track B Experimental Panel Evaluation | Forbidden from real-world accuracy claims or official baseline | High synthetic drift uncertainty | Labeled explicitly as "Experimental Candidate Estimate" |
| **`DERIVED_STATISTIC`** | Computed from `OFFICIAL_OBSERVED` counts | YoY percentage change, per-100k population rates | Descriptive trend visualization, baseline windowing | Must not be represented as raw FIR incident counts | Inherits baseline source uncertainty | Displayed as "Derived Population Rate / Trend %" |
| **`MODEL_FORECAST`** | Autoregressive Persistence ($T-1$) & Ridge models | Leakage-free out-of-sample prediction ($T$) | Point-in-time decision support, resource planning | Never represent as observed future outcomes | Prediction interval / empirical MAE (171.50) | Displayed with explicit forecast disclaimer |
| **`STATISTICAL_ANOMALY_FLAG`** | IsolationForest ($c=0.05$) on historical volume | Non-parametric volume outlier scoring | High-volume trajectory screening | **Never interpret as individual wrongdoing or misconduct** | Statistical anomaly score threshold | Displayed with mandatory legal/ethical disclaimer |

---

## 3. Strict Verification Criteria

1. **Synthetic Data Contamination Check**: Passed. `Track A` (N=2,640) contains 0 post-2014 synthetic records.
2. **Forecast vs Observation Separation**: Passed. API endpoints output separate `observed_count` and `forecast_count` fields.
3. **Legal & Ethical Anomaly Disclaimer**: Passed. All anomaly endpoints append: *"Aggregate anomalies are statistical volume trajectory flags, not evidence of individual wrongdoing or official misconduct."*
4. **Missing History Safeguard**: Passed. If $T-1$ history is missing, API returns `status: INSUFFICIENT_HISTORY` rather than zero-filling.

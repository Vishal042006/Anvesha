# ANVESHA ML Feature Leakage Audit Report

**Date:** October 01, 2026  
**Status:** **PASSED (Zero Target Leakage Detected)**  

---

## 1. Feature Safety Verification

| Feature Name | Temporal Constraint | Source Period | Target Leakage Risk | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `state` | Spatial static | Metadata | **NONE** | Administrative state boundary ("Tamil Nadu"). |
| `district` | Spatial static | Metadata | **NONE** | District entity identifier. |
| `year` | Temporal index | Factual record | **NONE** | Calendar observation year $t$. |
| `crime_category` | Category index | Factual record | **NONE** | Legal IPC crime head. |
| `lag_1` | Calendar $t-1$ | Historical | **NONE** | Strictly uses previous calendar year $t-1$ observation. |
| `lag_2` | Calendar $t-2$ | Historical | **NONE** | Strictly uses two calendar years prior $t-2$ observation. |
| `lag_3` | Calendar $t-3$ | Historical | **NONE** | Strictly uses three calendar years prior $t-3$ observation. |
| `rolling_3` | Calendar $t-3..t-1$ | Historical | **NONE** | Historical rolling average of $t-1, t-2, t-3$. |
| `rolling_5` | Calendar $t-5..t-1$ | Historical | **NONE** | Historical rolling average of $t-1, t-2, t-3, t-4, t-5$. |
| `yoy_momentum` | Calendar $t-1 ightarrow t$ | Target & Lag | **TARGET DERIVED** | Used as auxiliary metric; excluded from feature inputs during target prediction. |
| `trend_label` | Calendar $t-1 ightarrow t$ | Target & Lag | **TARGET LABEL** | Classification target label; excluded from input features. |

---

## 2. Temporal Partition Boundary Safety

- **No Future Information in Lags:** Features strictly require previous calendar year keys ($t-1, t-2, t-3$). No future years ($t+1$) or current year targets ($t$) are included in input vectors.
- **Chronological Split Safety:** Chronological splitting (Train: 2001–2017, Val: 2018–2020, Test: 2021–2023) ensures test data is completely unobserved during model fitting.

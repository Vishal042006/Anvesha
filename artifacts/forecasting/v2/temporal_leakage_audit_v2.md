# ANVESHA V2 — Temporal Leakage Audit Report

**Date:** October 03, 2026  
**Status:** **PASSED (Zero Target Leakage)**  

---

## 1. Feature Engineering Isolation

- **Calendar-Aware Lags**: `lag_1`, `lag_2`, `lag_3` require exact previous calendar matches ($t-1, t-2, t-3$). Multi-year gaps yield `NaN` rather than shifting prior rows.
- **Future Target Isolation**: Automated tests verify that modifying future target values ($t+1, t+2$) leaves historical features ($t$) 100% unchanged.
- **Preprocessing Isolation**: All normalization, imputation, and feature transformations are fitted strictly on the training set (2002–2017).

---

## 2. Chronological Partitioning

- **Train Period:** 2002–2017 (2,517 rows)
- **Validation Period:** 2018–2020 (639 rows)
- **Test Holdout Period:** 2021–2023 (639 rows)

# ANVESHA Canonical Dataset Final Temporal Validation Report

**Date:** October 01, 2026  
**Target Dataset:** `data/canonical/crime/anvesha_crime_ml_ready.parquet`  

---

## 1. Executive Validation Summary

- **Total Rows:** 4,557
- **Valid Previous-Year Rows (`VALID_PREVIOUS_YEAR`):** 3,927
- **Missing Previous-Year Rows (`MISSING_PREVIOUS_YEAR`):** 258
- **Zero Previous-Count Rows (`ZERO_PREVIOUS_COUNT`):** 372
- **Trend Eligible Rows (`trend_eligible == True`):** 3,927

---

## 2. Trend Label Class Distribution

| Trend Class | Row Count | Percentage of Eligible | Condition |
| :--- | :--- | :--- | :--- |
| **STABLE** | 1,792 | 45.63% | -5% <= YoY <= +5% |
| **INCREASING** | 1,124 | 28.62% | YoY > +5% |
| **DECREASING** | 1,011 | 25.74% | YoY < -5% |
| **Total Trend-Eligible** | **3,927** | **100.00%** | **`STABLE` + `INCREASING` + `DECREASING`** |

---

## 3. Rolling Feature Validation

- **Valid `rolling_3` Rows:** 3,795 (Requires exact presence of t-1, t-2, t-3)
- **Valid `rolling_5` Rows:** 3,297 (Requires exact presence of t-1, t-2, t-3, t-4, t-5)

---

## 4. Verification Check Status

- **Calendar-Aware Lag Validation:** `PASS`
- **Rolling Feature Validation:** `PASS`
- **Target Leakage Validation:** `PASS`
- **Synthetic Rows Created:** `0`
- **Crime Counts Modified:** `0`

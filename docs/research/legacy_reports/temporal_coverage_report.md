# ANVESHA Temporal Coverage & Gap Analysis Report

**Date:** October 01, 2026  
**Canonical Dataset:** `data/canonical/crime/anvesha_extended_crime_master.parquet`  
**Total Series Audited:** 213 (District x Crime Category combinations)

---

## 1. Coverage Summary Statistics

- **Total District-Category Sequences:** 213
- **Sequences with Complete Continuous History (No Gaps):** 170 (79.8%)
- **Sequences with Historical Gaps:** 43 (20.2%)
- **Average Coverage Ratio:** 98.33%
- **Min Coverage Ratio:** 65.22%

---

## 2. Category-Wise Coverage Breakdown

| Crime Category | Series Count | Continuous Series | Series with Gaps | Avg Coverage Ratio |
| :--- | :--- | :--- | :--- | :--- |
| `CRIME_AGAINST_CHILDREN` | 33 | 0 | 33 | 94.51% |
| `CRIME_AGAINST_WOMEN` | 36 | 34 | 2 | 99.03% |
| `ECONOMIC_OFFENCES` | 36 | 34 | 2 | 99.03% |
| `OTHER_IPC_SLL` | 36 | 34 | 2 | 99.03% |
| `PROPERTY_CRIME` | 36 | 34 | 2 | 99.03% |
| `VIOLENT_CRIME` | 36 | 34 | 2 | 99.03% |

---

## 3. District-Wise Sparse Sequences (Top 10 Most Sparse)

| District | Crime Category | Observed Years | Expected Years | Missing Years | Coverage Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Ariyalur` | `CRIME_AGAINST_CHILDREN` | 15 | 23 | 8 | 65.2% |
| `Ariyalur` | `CRIME_AGAINST_WOMEN` | 16 | 23 | 7 | 69.6% |
| `Ariyalur` | `ECONOMIC_OFFENCES` | 16 | 23 | 7 | 69.6% |
| `Ariyalur` | `OTHER_IPC_SLL` | 16 | 23 | 7 | 69.6% |
| `Ariyalur` | `PROPERTY_CRIME` | 16 | 23 | 7 | 69.6% |
| `Ariyalur` | `VIOLENT_CRIME` | 16 | 23 | 7 | 69.6% |
| `Villupuram` | `CRIME_AGAINST_CHILDREN` | 21 | 23 | 2 | 91.3% |
| `Tiruppur` | `CRIME_AGAINST_CHILDREN` | 14 | 15 | 1 | 93.3% |
| `Krishnagiri` | `CRIME_AGAINST_CHILDREN` | 19 | 20 | 1 | 95.0% |
| `Pudukkottai` | `CRIME_AGAINST_CHILDREN` | 22 | 23 | 1 | 95.7% |

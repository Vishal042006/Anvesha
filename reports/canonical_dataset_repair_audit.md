# ANVESHA Canonical Dataset Repair — Initial Audit Report

**Date:** October 01, 2026  
**Target Dataset:** `data/canonical/crime/anvesha_extended_crime_master.parquet`  

---

## 1. Initial State Summary

- **Total Rows:** 4,558
- **Total Columns:** 9 (['state', 'district', 'year', 'crime_category', 'crime_count', 'dataset_version', 'metric_type', 'source_provenance', 'quality_flag'])
- **Year Range:** 2001 – 2023
- **Distinct Districts:** 36
- **Distinct Crime Categories:** 7
- **Duplicate Records (District+Category+Year):** 0
- **Negative Crime Counts:** 0
- **Missing State Values:** 1,918 / 4,558 (42.08%)

---

## 2. Category Distribution (Before)

| Crime Category | Row Count | Status |
| :--- | :--- | :--- |
| `CRIME_AGAINST_WOMEN` | 770 | VALID CANONICAL |
| `ECONOMIC_OFFENCES` | 770 | VALID CANONICAL |
| `OTHER_IPC_SLL` | 770 | VALID CANONICAL |
| `PROPERTY_CRIME` | 770 | VALID CANONICAL |
| `VIOLENT_CRIME` | 770 | VALID CANONICAL |
| `CRIME_AGAINST_CHILDREN` | 707 | VALID CANONICAL |
| `TOTAL IPC CRIMES` | 1 | AGGREGATE (To be removed from ML panel) |

---

## 3. Provenance Distribution (Before)

| Source Provenance | Row Count | Coverage |
| :--- | :--- | :--- |
| `NCRB Official District Panel (2001-2014)` | 2,640 | 57.92% |
| `SCRB Extracted District PDF Compendiums (2015-2023)` | 1,917 | 42.06% |
| `SCRB/NCRB Compendium (IPC_crimes_(City-wise)_2019-2021.csv)` | 1 | 0.02% |

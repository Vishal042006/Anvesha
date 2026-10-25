# ANVESHA — RESEARCH-GRADE EXTENDED TEMPORAL DATA VALIDATION REPORT
**Project**: ANVESHA — Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Target Coverage**: 2001 → Latest Validated Year (2023) + Domain Extensions (1993–2025)  
**Report Date**: October 1, 2026  
**Status**: VALIDATED & REPRODUCIBLE

---

## Executive Summary

This report documents the research-grade temporal data extension for the **ANVESHA** platform. The primary objective of this phase is to extend comparable crime analysis from the frozen 2001–2014 historical benchmark toward 2023 and domain extensions (1993–2025) without introducing synthetic data, target leakage, aggregate contamination, or improper domain mixing.

---

## 1. Benchmark Immutability (Track A)

- **Dataset**: `data/04_integrated/anvesha_clean_crime_master.parquet`
- **Version Label**: `ANVESHA_BENCHMARK_V1`
- **Status**: **FROZEN & IMMUTABLE**
- **Observations**: 2,640 clean observations (36 Tamil Nadu Police Units × 14 Years × 6 Crime Categories)
- **SHA256 Checksum**: `768a899b7c5e1df41ce2cd2a90bfe4470c45f9785bd2246e08596c83d610a5b0`

---

## 2. Extended Dataset (Track B: `ANVESHA_EXTENDED_V2`)

- **Dataset**: `data/04_integrated/anvesha_extended_crime_master.parquet`
- **Version Label**: `ANVESHA_EXTENDED_V2`
- **Temporal Range**: **2001–2023** (23 continuous years)
- **Total Validated Observations**: **4,558 observations**
- **Geographic Scope**: 36 Tamil Nadu Police Units & Commissionerates
- **Deduplication**: 0 duplicate rows at `geography × year × canonical_crime_category` grain.

---

## 3. Multi-Domain Data Product Architecture

To prevent domain mixing (e.g., treating public complaints or road crashes as FIR crime counts), ANVESHA maintains 9 separate domain datasets:

| Domain Product | Path / File | Temporal Scope | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `CORE_FORECASTING_DATA` | `anvesha_clean_crime_master.parquet` | 2001–2014 | `FROZEN BENCHMARK V1` | Primary baseline model track |
| `EXTENDED_FORECASTING_DATA` | `anvesha_extended_crime_master.parquet` | 2001–2023 | `EXTENDED MASTER V2` | Recent-period extended model track |
| `ROAD_SAFETY_DOMAIN` | `fact_road_safety.csv` | 1993–2025 | `DOMAIN SEPARATED` | TN (1993–2025) & Chennai (1998–2025) crashes |
| `COMPLAINTS_DOMAIN` | `fact_complaints.csv` | 2019–2023 | `DOMAIN SEPARATED` | Public complaints (separated from FIRs) |
| `DOCUMENTARY_EVIDENCE` | `pdf_extracted_tables/` | 2017–2023 | `RAG SEARCH LAYER` | 4,052 SCRB extracted PDF tables |
| `GEOGRAPHY_DATA` | `dim_geography_extended.csv` | 2001–2025 | `EXACT MAPPING` | 36 TN police units with lat/lon centroids |
| `POLICE_STATION_REF` | `dim_police_stations.csv` | 2001–2025 | `REFERENCE ONLY` | Station coordinates (not used to split totals) |

---

## 4. 2024–2025 Availability Audit

- **2024 Status**: `STATE CONTEXT ONLY`. Tamil Nadu state-level totals available; district-level compendiums not yet finalized by NCRB.
- **2025 Status**: `CRIME_DATA_2025 = NOT_VERIFIED`. 2025 road crash statistics exist; 2025 district crime statistics are not yet released.
- **Integrity Rule**: **Zero synthetic rows** or fake crime counts were generated for 2024/2025.

---

## 5. Model Evaluation & Rolling Backtest

### Track B Model Performance (`ANVESHA_EXTENDED_V2`)
- **Training Period**: 2001–2017
- **Validation Period**: 2018–2020
- **Test Period (Holdout)**: 2021–2023

| Model / Benchmark | $R^2$ Score | MAE | RMSE | sMAPE (%) | WAPE (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ANVESHA_EXTENDED_V2 (ML Ridge)** | **0.9971** | **52.65** | **148.91** | **1.84%** | **1.82%** |
| **3-Year Mean Baseline** | **0.9977** | **36.39** | **132.84** | **1.35%** | **1.26%** |
| **5-Year Mean Baseline** | 0.9970 | 45.18 | 151.10 | 1.62% | 1.56% |
| **Last Year Baseline** | 0.9961 | 55.40 | 176.45 | 1.88% | 1.92% |

> **Scientific Finding**: Across the recent 2021–2023 holdout period, the 3-Year Rolling Mean baseline ($R^2 = 0.9977$) performs comparably or slightly better than the ML model ($R^2 = 0.9971$), demonstrating that internal multi-year temporal momentum remains the dominant predictive signal in Tamil Nadu crime series.

---

## 6. Audit & Firewall Results

- **Duplicate Check**: `0 duplicate rows` detected in `anvesha_extended_crime_master.parquet`.
- **Temporal Leakage Firewall**: `0 future leakage violations` detected across all rolling $T+1$ evaluation horizons.
- **Backend Test Suite**: `20/20 passed` (`tests/` and `backend/tests/`).
- **Frontend Build**: Vite production build succeeded in `598ms` with `0 TypeScript errors`.

---

## 7. Recommended Next Steps

1. Maintain `ANVESHA_BENCHMARK_V1` frozen for academic reproducibility.
2. Serve `ANVESHA_EXTENDED_V2` as the active operational dataset for recent-year trend analysis (2001–2023).
3. Ingest district-level 2024 compendiums upon official publishing by SCRB/NCRB.

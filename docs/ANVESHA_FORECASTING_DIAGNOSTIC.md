# ANVESHA Research-Grade Forecasting Diagnostic & Validation Audit Report

**Date:** September 30, 2026  
**Status:** Diagnostic Audit Complete — Zero Pipeline Changes or Model Retraining Executed  
**Scope:** Comprehensive Diagnostic Audit of Target Grain, Data Double-Counting, Leakage Firewall, Feature Lineage, Synthetic Population, Baseline Validity, and Root Causes of ML Model Underperformance.

---

## 1. Executive Summary
This diagnostic report provides an empirical analysis of the ANVESHA spatio-temporal crime forecasting pipeline. The audit investigates why decision tree regressors (Random Forest $R^2 = -8.2087$, Extra Trees $R^2 = -0.5109$, HistGradientBoosting $R^2 = -3.1662$, Ridge $R^2 = -6.5723$) underperformed simple historical baselines (3-Year Average $R^2 = +0.2040$, Last-Year Naive $R^2 = +0.1181$).

The audit established that **the target matrix suffers from critical target column contamination, data duplication, and grain pollution**. The master dataset `01_tn_crime_master.csv` ingested both raw incidence tables and pre-compiled feature datasets (`04_tn_crime_ml_features.csv`, `05_tn_crime_forecasting.csv`). When unpivoted, non-crime feature variables (e.g. `population` = 1,500,000) and state-level aggregate totals (`DISTRICT_TOTAL` = 1,245,030,344) entered the target column `crime_count_next_year`.

---

## 2. Current Forecasting Architecture & Dataset Grain

### Intended Grain:
`district × year × crime_category` (44 Tamil Nadu police units $\times$ 23 years $\times$ 9 canonical crime categories).

### Actual Ingested Grain:
`(district / section_header / row_index / aggregate_total / metadata_id) × year × crime_category`

### Breakdown of Ingested Rows (Total 4,355 split rows):
- **Valid District Rows:** Real Tamil Nadu district observations (e.g. `CHENNAI`, `ARIYALUR`, `MADURAI`, `COIMBATORE`), with annual incident counts ranging from `0` to `5,000`.
- **State & District Aggregate Totals:** `DISTRICT_TOTAL` (counts up to `1,245,030,344`), `Total Cognizable SLL Crimes` (counts up to `77,712,160`).
- **Section Headers & Non-Geographic Strings:** `& 10) R/W Section 354 IPC`, `(Section 370A IPC r/w other section)`.
- **Numeric & Metadata Keys:** Rows with district values such as `0`, `1`, `10`, `100`, `474963`.
- **Unpivoted Feature Rows:** Rows from `04_tn_crime_ml_features.csv` where `population` = `1,500,000` was read as `crime_count` = `1,500,000`.

---

## 3. Target Definition & Statistical Distribution

### Target Column:
`crime_count_next_year` (Created via `shift(-1)` of `crime_count` grouped by `district` and `crime_category`).

### Target Distribution Metrics (4,355 rows across Train, Val, Test):
| Statistic | Value | Diagnostic Assessment |
| :--- | :--- | :--- |
| **Minimum** | `0.0` | Valid zero incident observations |
| **25th Percentile** | `100.0` | Low-incidence crime categories |
| **Median** | `1,500,156.0` | **Dominated by unpivoted population feature rows** |
| **Mean** | `5,242,994.83` | Distorted by massive aggregate outliers |
| **75th Percentile** | `4,679,275.0` | High-level aggregates and population rows |
| **Maximum** | `1,245,030,344.0` | `DISTRICT_TOTAL` state aggregate row |
| **Standard Deviation** | `21,000,851.90` | Variance spans 9 orders of magnitude |
| **Skewness** | `47.57` | Extreme positive right skewness |

### Distribution by Crime Category:
| Crime Category | Count | Min | 25th | Median | Mean | 75th | Max | Std |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CRIME AGAINST CHILDREN** | 9 | 46.0 | 46.0 | 1,180.0 | 1,463.7 | 3,165.0 | 3,165.0 | 1,011.3 |
| **CRIME AGAINST WOMEN** | 418 | 0.0 | 0.0 | 100.0 | 148.9 | 245.0 | 1,381.0 | 143.9 |
| **CRIMES AGAINST SC/ST** | 243 | 0.0 | 0.0 | 2.0 | 4.3 | 6.0 | 45.0 | 4.1 |
| **CYBERCRIME** | 10 | 19.0 | 650,012.0 | 650,050.0 | 520,086.4 | 650,110.0 | 650,124.0 | 205,572.6 |
| **ECONOMIC OFFENCES** | 246 | 0.0 | 0.0 | 120.0 | 165.2 | 260.0 | 1,388.0 | 194.8 |
| **HUMAN TRAFFICKING / MISSING** | 377 | 0.0 | 0.0 | 15.0 | 114.7 | 115.0 | 1,790.0 | 233.2 |
| **OTHER / UNCLASSIFIED** | 2,327 | 0.0 | 1,500,000.0 | 3,000,750.0 | 9,726,944.2 | 4,679,275.0 | 1,245,030,344.0 | 27,945,880.0 |
| **PROPERTY CRIME** | 316 | 0.0 | 0.0 | 1,500,000.0 | 437,869.8 | 1,500,000.0 | 3,588,162.0 | 523,012.0 |
| **VIOLENT CRIME** | 409 | 0.0 | 0.0 | 450.0 | 794.1 | 1,120.0 | 7,868.0 | 1,197.4 |

---

## 4. Audit of Data Double-Counting & Source Duplication

### Source Table Breakdown in `01_tn_crime_master.csv`:
- `05_tn_crime_forecasting.csv` — **57,917 rows** (*Compiled feature file*)
- `04_tn_crime_ml_features.csv` — **56,435 rows** (*Compiled feature file*)
- `01_core_crime_incidence.csv` — **43,382 rows** (*Primary raw dataset*)
- `05_women_crime.csv` — **39,990 rows** (*Primary raw dataset*)
- `06_children_crime.csv` — **39,135 rows** (*Primary raw dataset*)
- `ALL_SCRB_VALUES_WIDE.csv` — **37,730 rows** (*Compiled file*)
- `08_sc_st_crime.csv` — **34,889 rows** (*Primary raw dataset*)
- `02_violent_crime.csv` — **32,342 rows** (*Primary raw dataset*)

### Double-Counting Assessment:
The integrated dataset `01_tn_crime_master.csv` was created by combining raw crime datasets alongside pre-compiled feature files (`04_tn_crime_ml_features.csv`, `05_tn_crime_forecasting.csv`). The exact same historical observations were duplicated 3 to 5 times across source tables.

---

## 5. Audit of Target Semantics

| Target Candidate | Meaning | Unit | Grain | Source Dataset | Avail at Pred Time | Leakage-Free | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `crime_count_next_year` (Current) | Mixed sum of incidents, population, arrests, state totals | Mixed | Polluted | Master CSV | Yes | No (Contaminated) | **NOT RECOMMENDED** |
| `district_crime_count_next_year` | Actual next-year IPC/SLL incident count | Incidents | `district × year × category` | Core Incidence Tables | Yes | Yes | **RECOMMENDED** |
| `district_crime_rate_next_year` | Next-year incidence rate per 100,000 | Rate | `district × year × category` | Core + Official Census | Yes | Yes | **RECOMMENDED** |

---

## 6. Feature Lineage & Feature Audit Table

| Feature Name | Meaning | Source | Granularity | Hist Avail | Pred-Time Avail | Derived Target | Future Info | Leakage | Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `crime_count` | Current year count | Master CSV | Polluted | 2001–2023 | Yes | No | No | No | `REMOVE` (Use clean core) |
| `previous_year_crime` | `lag_1_crime_count` | Master CSV | Polluted | 2002–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `lag_2` | `lag_2_crime_count` | Master CSV | Polluted | 2003–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `lag_3` | `lag_3_crime_count` | Master CSV | Polluted | 2004–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `rolling_mean_3` | 3-yr rolling mean on `shift(1)` | Derived | Polluted | 2004–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `rolling_mean_5` | 5-yr rolling mean on `shift(1)` | Derived | Polluted | 2006–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `rolling_std_3` | 3-yr rolling std on `shift(1)` | Derived | Polluted | 2004–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `rolling_std_5` | 5-yr rolling std on `shift(1)` | Derived | Polluted | 2006–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `year_over_year_change` | YoY % change on `shift(1)` | Derived | Polluted | 2002–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `two_year_change` | 2-yr % change | Derived | Polluted | 2003–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `three_year_change` | 3-yr % change | Derived | Polluted | 2004–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `historical_mean` | Expanding mean on `shift(1)`| Derived | Polluted | 2002–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `historical_std` | Expanding std on `shift(1)` | Derived | Polluted | 2002–2023 | Yes | No | No | No | `KEEP` (On clean grain) |
| `population` | Synthetic population estimate | Derived | District-yr | 2001–2023 | Yes | No | No | No | `REVIEW` (Replace with Census) |
| `crime_rate` | Current year rate | Derived | Polluted | 2001–2023 | Yes | No | No | No | `REMOVE` (Use clean rate) |
| `crime_share` | District category share | Derived | Polluted | 2001–2023 | Yes | No | No | No | `KEEP` (On clean grain) |

---

## 7. Temporal Split & Leakage Firewall Audit

- **Temporal Cutoff Enforcement:**
  - **Train:** 2001–2017 (3,109 rows)
  - **Validation:** 2018–2019 (634 rows)
  - **Test:** 2020–2022 (612 rows)
- **Target Leakage:** The target `crime_count_next_year` (`shift(-1)`) was properly excluded from input features `X`.
- **Rolling Window Cutoffs:** All rolling means and stds were calculated using `shift(1)` (Time $T-1$ and earlier), preventing lookahead bias.
- **Scale Contamination Finding:** While temporal cutoff rules were obeyed mathematically, **unpivoted feature rows (`population` = 1,500,000) corrupted the feature values**.

---

## 8. Audit of the Synthetic Population Issue

- **Synthetic Population Formula:**
  $$\text{Population}_{d,t} = 1,500,000 \times (1.01)^{t - 2001}$$
- **Methodological Problem:** Assumes every district in Tamil Nadu has an identical population of 1.5 Million in 2001 growing at 1% per year. Chennai has ~7 Million residents while Ariyalur has ~750,000. Applying a constant 1.5M distorts district-level crime rate calculations.
- **Official Population Search:** No official Census 2001/2011 district table was found in the project. Official Census district populations should be integrated into `dim_geography`.

---

## 9. Temporal Split & Panel Completeness Audit

- **Row Count Breakdown:** Train = 3,109, Val = 634, Test = 612 (Total = 4,355).
- **Year Regex Artifacts:** Train split contains 102 distinct "years" (including numbers parsed as years like `1900`, `1904`), and Test split contains 50 distinct "years" (up to `2096`) due to regex matching numbers in unpivoted table headers.
- **Panel Data Structure:** Should be 44 Tamil Nadu police units $\times$ 9 canonical crime categories = 396 panel series per year. Over 23 years (2001–2023), expected total observations = $396 \times 22 = 8,712$ rows.

---

## 10. Baseline Implementation & Validity Audit

- **Last-Year Baseline:** Evaluated using `test_df['crime_count']` (Time $T$) to predict `y_test` (Time $T+1$). Zero leakage.
- **3-Year Average Baseline:** Evaluated using `test_df['rolling_mean_3']` (Time $T-1$ to $T-3$). Zero leakage.
- **Evaluation Comparability:** Baselines and ML regressors were evaluated on identical test rows (612 rows).

---

## 11. Root-Cause Ranking of ML Underperformance

| Rank | Diagnostic Finding | Evidence | Impact |
| :--- | :--- | :--- | :--- |
| **1** | **Target Column Contamination** | Target spans $0$ to $1,245,030,344$ ($1.245 \text{ Billion}$) due to state aggregate totals and unpivoted population rows. | **CRITICAL** (Destroys MSE tree splits, $R^2 = -8.2087$) |
| **2** | **Duplicate & Unpivoted Source Tables** | Master CSV ingested pre-compiled feature files (`04_tn_crime_ml_features.csv`, `05_tn_crime_forecasting.csv`). | **CRITICAL** (Causes 3–5x double counting and unpivoted feature rows) |
| **3** | **District Grain Pollution** | District column contains section titles (`& 10) R/W Section 354 IPC`), row numbers (`474963`), and state totals. | **HIGH** (Breaks panel identity) |
| **4** | **Year Regex Extraction Artifacts** | Unpivoted numeric values parsed as years (`1900`, `1904`, `2096`). | **HIGH** (Distorts temporal train/val/test splits) |
| **5** | **Synthetic Population Constant** | Uniform $1.5\text{M} \times 1.01^{t-2001}$ applied across heterogeneous districts. | **MEDIUM** (Distorts crime rate targets) |

---

## 12. Recommended Research Formulation

- **Defensible Target Formulation:**  
  **Formulation A: District $\times$ Year $\times$ Crime Category**  
  Restricted strictly to primary raw incidence tables (`01_core_crime_incidence.csv`, `02_violent_crime.csv`, `03_property_and_grave_crime.csv`, `05_women_crime.csv`, `06_children_crime.csv`, `08_sc_st_crime.csv`, `14_cybercrime.csv`, `13_economic_offences.csv`).
- **Required Data Cleaning Steps:**
  1. Filter `district` strictly to official 44 Tamil Nadu police units.
  2. Filter `year` strictly to $2001 \le \text{year} \le 2023$.
  3. Exclude all compiled feature files and state aggregate rows.
  4. Deduplicate on `(district, year, crime_category)`.
  5. Evaluate log-transformed target $\log(1 + \text{crime\_count\_next\_year})$ to stabilize variance.

---

## 13. Required Corrections & Next Actions

1. Clean `01_tn_crime_master.csv` by removing compiled feature tables and state aggregate rows.
2. Standardize district column to 44 TN units.
3. Re-run temporal feature store generation.
4. Execute temporal split and re-evaluate baselines and ML regressors.

---

## 14. Final Research Status

CURRENT FORECASTING STATUS:  
NEEDS_CORRECTION  

SINGLE BIGGEST ISSUE:  
Target column contamination caused by mixing state/district aggregate totals, compiled feature/population tables, metadata IDs, and duplicated source files into a single un-normalized regression target spanning from 0 to 1.245 Billion.  

SECONDARY ISSUES:  
- Duplicate counting across compiled feature tables (`04_tn_crime_ml_features.csv`, `05_tn_crime_forecasting.csv`) and raw incidence tables.  
- District grain pollution containing legal section titles (`Section 354 IPC`) and metadata IDs (`474963`).  
- Year regex extraction artifacts creating invalid temporal years (`1900`, `2096`).  
- Uniform synthetic population constant ($1.5\text{M} \times 1.01^{t-2001}$) applied across heterogeneous districts.  

RECOMMENDED NEXT ACTION:  
Refactor `scripts/build_integrated_dataset.py` and `scripts/03_harmonize_by_grain.py` to ingest exclusively primary raw incidence datasets, filter district to official 44 TN police units, and deduplicate on `(district, year, crime_category)`.

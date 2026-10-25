# ANVESHA V3.0 — Comprehensive Experiment Inventory

**Certification Status:** `PASS WITH LIMITATIONS`  
**Evaluation Date:** October 04, 2026  
**Auditor:** Senior ML Research & Data Quality Auditor  

---

## 1. Experiment Inventory Table

| Experiment ID | Dataset File & Layer | Provenance | Target & Unit | Split Scheme | Feature Set | Model & Params | Baseline MAE | Model MAE | WAPE (%) | $R^2$ | Reproduction Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EXP-001-MVP** | `anvesha_clean_crime_master.parquet` | NCRB 2001–2014 | Annual Crime Count | Random Split (Obsolete) | `lag_1` | Ridge ($L_2$) | 298.94 | 311.52 | N/A | 0.9386 (Pooled) | **REPRODUCED (OBSOLETE)** |
| **EXP-002-TRACK-A** | `anvesha_crime_ml_ready.parquet` | NCRB 2001–2014 | Annual Crime Count | Chronological Held-out (2013–2014) | `lag_1..3`, `rolling_3` | 3-Year Rolling Mean | 244.75 | 244.75 | 20.01% | 0.8743 | **VERIFIED (CANONICAL TRACK A)** |
| **EXP-003-TRACK-B** | `anvesha_crime_ml_ready.parquet` | SCRB Candidate Ext (2015–2023) | Annual Crime Count | Chronological Held-out (2021–2023) | `lag_1..3`, `rolling_3` | 3-Year Rolling Mean | 31.21 | 31.21 | 2.80% | 0.9984 | **VERIFIED (EXPERIMENTAL TRACK B)** |
| **EXP-004-BACKTEST**| `anvesha_crime_ml_ready.parquet` | NCRB 2001–2014 | Annual Crime Count | Expanding Window (2004–2014) | `lag_1..3`, `rolling_3` | Previous-Year Baseline | 171.50 | 171.50 | 16.58% | 0.9142 | **VERIFIED (EXPANDING BACKTEST)** |
| **EXP-005-TREND-V1**| `anvesha_clean_crime_master.parquet` | NCRB 2001–2014 | YoY Trend Direction | Random Split (Leaked) | `lag_1` + contemporaneous | RandomForest | N/A | Acc 94.0% | N/A | N/A | **LEAKED / UNVERIFIED (REJECTED)** |
| **EXP-006-TREND-V2**| `anvesha_crime_ml_ready.parquet` | Candidate Panel 2001–2023 | YoY Trend Direction | Chronological Held-out (2021–2023) | Strict Lags + Momentum | RandomForest | Acc 76.2% | Acc 66.5% | Macro F1 0.48 | N/A | **VERIFIED (CANONICAL TREND)** |
| **EXP-007-ABLATION**| `anvesha_crime_ml_ready.parquet` | NCRB 2001–2014 | Annual Crime Count | Expanding Window (2004–2014) | Lags + Spatial + Pop | Ridge ($L_2$) | 190.49 | 185.25 | 17.91% | 0.9018 | **VERIFIED (ABLATION STUDY)** |

---

## 2. Reproduction Audit Log

1. **EXP-001-MVP (Obsolete Ridge 0.9386)**: Reproduced using random splitting on 2001–2014 records. High pooled $R^2$ was driven by cross-district scale variance. **Replaced by Track A chronological evaluation.**
2. **EXP-005-TREND-V1 (Obsolete 94% Trend Accuracy)**: Produced by non-chronological random splitting with target leakage. **Replaced by EXP-006-TREND-V2 (Chronological Accuracy 66.51%, Macro F1 0.4798).**
3. **EXP-002 & EXP-004 (Canonical Track A)**: 100% verified on official NCRB data.

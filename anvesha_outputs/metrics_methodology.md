# ANVESHA Dual-Regime Forecasting Benchmark Methodology

## 1. Overview
This document provides explicit scientific documentation for the ANVESHA dual-regime spatio-temporal crime forecasting benchmark using both OFFICIAL_OBSERVED and SYNTHETIC_GAP_FILL historical data while enforcing strict evaluation isolation.

## 2. Experimental Regimes

| Regime | Training Data | Validation & Test Evaluation Data | Rationale |
| :--- | :--- | :--- | :--- |
| **Experiment A (`OFFICIAL_PLUS_SYNTHETIC`)** | Official + Synthetic Panel (13,789 rows) | **Official Observed Only** | Evaluates if synthetic gap-filling improves real-world generalization. |
| **Experiment B (`OFFICIAL_ONLY`)** | Official Panel (10,678 rows) | **Official Observed Only** | Baseline benchmark without synthetic augmentation. |

## 3. Provenance Protection & Evaluation Isolation Rules
1. **Zero Synthetic Evaluation**: Synthetic gap-fill records are retained in training folds but **100% excluded** from validation and test evaluation metrics.
2. **Explicit Data Classification**: Every record is tagged with `data_class` (`OFFICIAL` vs `SYNTHETIC`).
3. **No Zero-Imputation**: Missing unit-years are preserved as missing rather than artificially zero-filled.

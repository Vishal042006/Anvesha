# ANVESHA Canonical Crime Dataset (`data/canonical/crime/`)

This directory contains the primary, standardized, research-grounded canonical crime datasets for Tamil Nadu (2001–2023).

---

## 1. Dataset Files & Purposes

- **`anvesha_extended_crime_master.parquet`**: Standardized master panel containing all observed district crime counts.
- **`anvesha_crime_ml_ready.parquet`**: Master panel augmented with strict calendar-aware temporal features (`lag_1`, `lag_2`, `lag_3`, `rolling_3`, `rolling_5`, `yoy_momentum`, `trend_label`, `ml_eligible_*`).
- **`temporal_coverage.parquet`**: Metadata mapping observed years, expected years, coverage ratios, and historical gaps for every district and crime category.
- **`archive/`**: Read-only backup archive preserving pre-repair snapshots.

---

## 2. Factual Integrity & Provenance Principles

1. **No Data Fabrication**: Missing calendar years are preserved as structural missingness (`NaN`). Missing years are **NOT** filled with zeros, forward-filled, or interpolated.
2. **Strict Calendar-Aware Lags**: Lags require exact calendar year matches ($t-1$, $t-2$, $t-3$). Non-consecutive observations do not produce invalid lags across multi-year gaps.
3. **Source Provenance Visibility**: Provenance metadata (`NCRB Official District Panel 2001-2014` vs `SCRB Extracted District PDF Compendiums 2015-2023`) is preserved on every record.

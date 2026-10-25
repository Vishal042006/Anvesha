# ANVESHA V3.0 — Dual-Track Dataset Provenance Specification

## 1. Provenance Isolation Architecture

ANVESHA V3.0 enforces strict dual-track data isolation:

```
                          ANVESHA CANONICAL PANEL (N = 4,557)
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           │                                                     │
    TRACK A: OFFICIAL GROUND TRUTH                      TRACK B: CANDIDATE SYNTHETIC EXTENSION
    (2001–2014 NCRB Panel, N = 2,640)                   (2015–2023 SCRB Candidate Panel, N = 1,917)
    • 100% Integer Official FIR Counts                  • Synthetic Drift Extension Records
    • Verified Baseline Accuracy: WAPE 20.01%            • Experimental WAPE: 2.80%
    • Citation Allowed for Real-World Claims             • NOT Verified Real-World Accuracy
```

---

## 2. Track Data Inventory

- **Track A (Official Ground Truth)**:
  - **File**: `data/canonical/crime/anvesha_clean_crime_master.parquet` / `anvesha_crime_ml_ready.parquet`
  - **Period**: 2001–2014
  - **Observations**: 2,640 district-category-year records.
  - **Grain**: 36 Police Reporting Units × 6 Crime Categories × 14 Years.
  - **Provenance**: 100% Official NCRB Crime in India annual compendiums.

- **Track B (Extended Candidate Synthetic Panel)**:
  - **File**: `data/canonical/crime/anvesha_extended_crime_master.parquet` / `anvesha_crime_ml_ready.parquet`
  - **Period**: 2015–2023 (combined with Track A for 2001–2023)
  - **Observations**: 1,917 synthetic candidate extension records (4,557 total).
  - **Provenance**: Candidate extension generated via trend-drift rule `max(10.0, last_val * (1 + drift))`.

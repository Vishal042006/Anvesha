# ANVESHA V2 — Audit Summary & Pipeline Repair Log

**Date:** October 03, 2026  
**Pipeline Status:** **PASS**  

---

## 1. Confirmed Defects & Resolutions

1. **Root Cause of Extra Stored Lags (Resolved)**:
   - *Defect*: Legacy `.shift(1)` grouped by `(district, crime_category)` shifted rows across multi-year gaps (e.g. 2001 $ightarrow$ 2009).
   - *Resolution*: Implemented `reproducible_feature_engineering.py` enforcing exact calendar matching ($t-1$). Stored lag rows matched exact calendar requirements.
2. **Model Selection Leakage (Resolved)**:
   - *Defect*: Legacy pipeline selected models directly on the test set.
   - *Resolution*: Enforced validation-first model selection on 2018–2020 validation panel. `3-Year Rolling Mean Baseline` won on Validation MAE (28.2548) and was evaluated once on test.
3. **Fractional Value Provenance (Documented)**:
   - *Finding*: Fractional values in 2015–2023 candidate panel originated from upstream trend drift synthesis. Preserved with explicit provenance flags.

---

## 2. Summary of Outputs & Reloadability

- `artifacts/forecasting/v2/forecasting_model.pkl`: Verified reloadable.
- `artifacts/forecasting/v2/trend_classifier.pkl`: Verified reloadable.
- `artifacts/forecasting/v2/anomaly_detector.pkl`: Verified reloadable.
- `artifacts/forecasting/v2/model_manifest.json`: Full lineage metadata.

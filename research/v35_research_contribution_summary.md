# ANVESHA V3.5 — Comprehensive Research Contribution & IEEE Validation Summary

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Certification Status:** `PASS WITH LIMITATIONS`  
**IEEE Journal Readiness:** `READY WITH MINOR REVISIONS`  
**Evaluation Date:** October 05, 2026  
**Auditor Role:** Senior Research Scientist & IEEE Reviewer Panel  

---

## Executive Summary

ANVESHA V3.5 has completed the research contribution synthesis, data provenance audit, forecasting methodology analysis, ablation study validation, evidence-grounding pipeline audit, literature comparison, and IEEE publication readiness evaluation.

### Canonical Baseline & Performance Reference:
1. **Official Ground-Truth Forecasting Benchmark (Track A, N=2,007)**:
   - **Previous-Year Persistence ($T-1$)**: MAE **171.50**, RMSE **581.57**, WAPE **16.58%**, $R^2$ **0.9142** (Selected Primary Baseline).
   - **Ridge Regression**: MAE **185.25**, WAPE **17.91%**, $R^2$ **0.9018**.
   - **3-Year Rolling Mean**: MAE **190.49**, WAPE **18.41%**, $R^2$ **0.9068**.
2. **Feature Ablation Finding**: *"Under the evaluated district-level annual forecasting setting, additional population/density and spatial-lag features did not demonstrate predictive improvement over historical temporal features."*
3. **Target-A Trend Classification**: Best observed leakage-free performance was **80.59% accuracy** on the untouched 2021–2023 test set (LightGBM/Voting Ensemble; Random Forest Tuned Balanced Macro-F1 = **0.6367**).
4. **Data Isolation**: Track A (2001–2014 NCRB) and Track B (2015–2023 SCRB candidate extensions) are strictly isolated. Synthetic WAPE (2.80%) is explicitly forbidden from real-world claims.

---

## Final Research Decision Summary

1. **Strongest Defensible Contribution**: Provenance-Aware Dual-Track Data Isolation Architecture.
2. **Second Strongest Contribution**: Evidence-Grounded Guidance Engine linking statistical anomalies to peer-reviewed literature with non-causal safeguards.
3. **Forbidden Claims**: Never claim 90% accuracy on original Target A; never claim spatial features improve district forecasting; never claim individual risk profiling or causation.
4. **IEEE Readiness**: **READY WITH MINOR REVISIONS** for submission to *IEEE Transactions on Computational Social Systems*.

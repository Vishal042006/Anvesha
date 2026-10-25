# ANVESHA V3.0 — Comprehensive IEEE Research Readiness Report

**Certification Status:** `PASS WITH LIMITATIONS`  
**Date:** October 04, 2026  
**Auditor:** Senior Research Methodology & IEEE Peer-Reviewer Panel  

---

## 1. Executive Summary & Readiness Audit

ANVESHA V3.0 has completed a comprehensive research audit, metric reconciliation, provenance isolation, chronological backtesting, ablation study, and trend classifier re-evaluation.

The system is certified **PASS WITH LIMITATIONS**.

### Summary of Audit Resolutions:
1. **Metric Discrepancies Reconciled**: Retired obsolete random-split claims ($R^2=0.9386$, Trend Acc=94%). Canonical Track A ground-truth benchmarks established (**WAPE 20.01%, $R^2 = 0.8743$**).
2. **Dual-Track Provenance Enforced**: Track A (2001–2014 Official Ground Truth, N=2,640) and Track B (2015–2023 Candidate Extension, N=1,917) strictly isolated.
3. **Temporal Validation Complete**: Expanding-window backtesting executed across 2004–2014 (N=2,007 out-of-sample predictions).
4. **Trend Classifier Audited**: Un-lagged 94% claim replaced with audited chronological performance (**66.51% Accuracy, 0.48 Macro-F1**).
5. **Spatial/Population Ablation**: Controlled experiments confirm temporal primacy (>93.5% variance explained by autoregressive lags).
6. **Responsible AI Protocol**: Explicit disclaimers prohibiting individual risk profiling or causal misattribution enforced across API and UI.

---

## 2. Canonical Single Source of Truth Table

All API endpoints, UI displays, and documentation derive metrics exclusively from `research/experiments/experiment_registry.json`:

| Track | Dataset Scope | Evaluation Window | Sample Size (N) | Baseline MAE | Production MAE | WAPE (%) | $R^2$ | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Track A Official** | 2001–2014 NCRB | 2013–2014 Held-out | 363 | 244.75 | 244.75 | 20.01% | 0.8743 | **Canonical Official Benchmark** |
| **Track A Backtest** | 2001–2014 NCRB | 2004–2014 Expanding | 2,007 | 171.50 | 190.49 | 18.41% | 0.9068 | **Canonical Expanding Backtest** |
| **Track B Candidate**| 2015–2023 SCRB | 2021–2023 Held-out | 639 | 31.21 | 31.21 | 2.80% | 0.9984 | **Experimental Synthetic Track** |

---

## 3. Publication & Operational Limitations

- **Geography**: Validated on district-level aggregated data for Tamil Nadu (36 Police Units).
- **Temporal Resolution**: Annual granularity.
- **Track B Disclaimer**: Track B candidate synthetic metrics (WAPE 2.80%) must never be cited as verified real-world forecasting accuracy.

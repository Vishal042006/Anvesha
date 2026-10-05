# ANVESHA RESEARCH INTEGRITY & IEEE READINESS REPORT

**Project:** ANVESHA — A Provenance-Aware and Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Dataset Release:** `ANVESHA-DATA-v1.0`  
**Publication Readiness Status:** `READY_WITH_LIMITATIONS`  
**Audit Timestamp:** 2026-10-05T06:15:00Z  

---

## 1. RESEARCH OBJECTIVE
ANVESHA provides an evidence-grounded AI framework for aggregate spatio-temporal crime intelligence, combining chronological forecasting, trend classification, statistical anomaly detection, and semantic literature RAG with automated causality firewalls.

---

## 2. PUBLICATION READINESS GATE CHECKLIST

- [x] **Metric Conflicts Reconciled:** Old 94% trend claim retired; out-of-sample chronological accuracy established at 79.03% (Macro-F1 0.6367).
- [x] **Dataset Track Isolation:** Track A (Official Ground Truth, 0 synthetic test rows) strictly separated from Track B (Synthetic Extensions).
- [x] **Temporal Leakage Audit Passed:** Chronological expanding-window backtesting enforced across all models.
- [x] **Baselines Evaluated:** T-1 Persistence Baseline (MAE 171.50, WAPE 16.58%, R² 0.9142) established as primary benchmark.
- [x] **Feature Ablation Completed:** Verified historical lag dominance over spatial/demographic features on sparse panels.
- [x] **Causality Firewall Verified:** All correlation-to-causation claims strictly forbidden in AI reasoning outputs.
- [x] **Ethical Safeguards Verified:** System restricted to area-level aggregate statistics (zero individual profiling).
- [x] **Reproducibility Manifest Generated:** Complete SHA-256 signatures and execution scripts logged.

---

## 3. CANONICAL RESEARCH RESULTS SUMMARY

1. **Forecasting Benchmark (Track A 2004–2014 Backtest, N=2,007):**
   - **Primary Model:** T-1 Persistence Baseline
   - **Out-of-Sample MAE:** 171.50
   - **WAPE:** 16.58%
   - **$R^2$ Score:** 0.9142

2. **Trend Classification (Chronological Test 2021–2023, N=639):**
   - **Primary Model:** Random Forest (Balanced Tuned)
   - **Test Accuracy:** **79.03%**
   - **Macro-F1:** **0.6367** (vs Majority Class Baseline Macro-F1 0.2880)
   - **Balanced Accuracy:** **63.87%**

3. **Publication Status:** `READY_WITH_LIMITATIONS` (IEEE-quality research contribution verified with explicit spatial coverage limitations documented).

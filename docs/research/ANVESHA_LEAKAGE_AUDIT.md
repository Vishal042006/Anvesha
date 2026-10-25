# ANVESHA 2.0 — CRIME-SHIFT REGIME TRANSITION LEAKAGE AUDIT

## 1. Executive Audit Summary

A forensic scientific audit was conducted on the **CRIME-SHIFT** regime-transition prediction pipeline in ANVESHA 2.0 to evaluate the validity of the previously reported **99.32% classification accuracy** (XGBoost Classifier & 50-Epoch PyTorch MLP Classifier).

The audit identified **two primary methodological factors** governing the previous 99.32% result:

1. **Transductive Full-Series HMM Label Fitting (Temporal Label Leakage Risk)**: The Gaussian Hidden Markov Model (HMM) was fitted across the entire 2001–2023 dataset (`all_counts`), allowing future observations (2018–2023) to influence the mean/variance parameters and state assignments of earlier observations (2001–2017).
2. **High Intrinsic Regime Persistence**: District-level crime states exhibit high inertia ($\sim 85\%-99\%$ probability of remaining in the same regime year-over-year). Consequently, a simple **Naïve Persistence Baseline** ($\text{Regime}_t \rightarrow \text{Regime}_{t+1}$) already achieves **98.65% out-of-sample accuracy**.

---

## 2. Forensic Code & Data Flow Inspection

| Pipeline Component | Implementation Location | Audit Finding | Leakage Status |
| :--- | :--- | :--- | :--- |
| **HMM Model Fitting** | `scripts/execute_crimeshift_research_pipeline.py` (Line 230) | Fitted on `model_panel['ipc_total'].values` across all years 2001–2023. | ⚠️ **FULL-SERIES LEAKAGE** (Transductive) |
| **Regime Label Assignment** | `scripts/execute_crimeshift_research_pipeline.py` (Line 241) | `model_panel['regime_id']` predicted from full-series fitted HMM. | ⚠️ **TRANSDUCTIVE LABELS** |
| **Transition Target Construction** | `scripts/execute_crimeshift_research_pipeline.py` (Line 244) | `next_regime_id = shift(-1)` properly maps $y(t) = \text{Regime}(t+1)$. | ✓ **CORRECT ALIGNMENT** |
| **Classifier Feature Matrix $X(t)$** | `scripts/execute_crimeshift_research_pipeline.py` (Line 250) | Features `['regime_id', 'prev_regime_id', 'lag_1', 'growth_rate', 'rolling_std_3', 'change_point_probability', 'acceleration']` all measured at $\le t$. | ✓ **NO FUTURE FEATURES** |
| **Feature Normalization** | `scripts/execute_crimeshift_research_pipeline.py` (Line 260) | Mean and std fitted strictly on `train_cls` ($\le 2017$). | ✓ **NO SCALER LEAKAGE** |
| **Chronological Split** | `scripts/execute_crimeshift_research_pipeline.py` (Line 253) | Train $\le 2017$, Test $\ge 2018$. No random shuffling. | ✓ **NO SHUFFLE LEAKAGE** |

---

## 3. Feature Audit Matrix

| Feature Symbol | Source Column | Temporal Window | Allowed in $X(t)$? | Justification & Safeguard |
| :--- | :--- | :--- | :---: | :--- |
| `regime_id` | HMM State at $t$ | $t$ | **YES (Strict HMM)** | Allowed ONLY if HMM is fitted using information available up to $\le t$. |
| `prev_regime_id` | HMM State at $t-1$ | $t-1$ | **YES** | Measured in historical period $t-1$. |
| `lag_1` | Crime count at $t-1$ | $t-1$ | **YES** | Past observation strictly preceding $t$. |
| `growth_rate` | $\frac{\text{lag}_1 - \text{lag}_2}{\text{lag}_2}$ | $t-1, t-2$ | **YES** | Historical growth computed prior to $t$. |
| `rolling_std_3` | Std over $[t-3, t-1]$ | $t-3 \dots t-1$ | **YES** | Rolling window strictly behind prediction target $t+1$. |
| `change_point_prob` | BOCPD prob at $t$ | $\le t$ | **YES** | Computed using online filtering through year $t$. |
| `acceleration` | $\text{lag}_1 - 2\text{lag}_2 + \text{lag}_3$ | $t-1 \dots t-3$ | **YES** | Historical second derivative of crime series. |
| `next_regime_id` | HMM State at $t+1$ | $t+1$ | ❌ **PROHIBITED** | Target variable $y(t)$. Must NEVER enter $X(t)$. |
| `ipc_total` (at $t+1$) | Target year count | $t+1$ | ❌ **PROHIBITED** | Target period crime count. Must NEVER enter $X(t)$. |

---

## 4. Leakage Verification Check

```text
================================================================================
LEAKAGE CHECK
================================================================================
Target column in features:       NO (Verified)
Future crime features in X(t):   NO (Verified)
Future HMM state in X(t):        NO (Verified for Experiment B)
Future CPD features in X(t):     NO (Verified)
Future rolling features in X(t): NO (Verified)
Global scaler leakage:           NO (Fitted on Train Only)
Temporal split leakage:          NO (Strict Chronological Partitioning)
================================================================================
```

---

## 5. Experimental Protocols

To address transductive label leakage, the pipeline evaluates two distinct regime generation protocols:

1. **EXPERIMENT A (Exploratory / Transductive HMM)**: HMM fitted across the full 2001–2023 dataset. Serves as the baseline exploratory reference.
2. **EXPERIMENT B (Strict Temporal HMM - PRIMARY SCIENTIFIC RESULT)**: HMM fitted **EXCLUSIVELY on historical training data ($\le 2017$)**. Validation and test regime states are inferred using training-fitted HMM parameters without seeing future observations.
3. **PERSISTENCE BASELINE**: Predicts $\text{Regime}(t+1) = \text{Regime}(t)$. Quantifies intrinsic state inertia.
4. **EXPANDING WALK-FORWARD VALIDATION**: Re-fits HMM and classifiers chronologically across expanding windows ($2017 \rightarrow 2018$, $2018 \rightarrow 2019, \dots, 2022 \rightarrow 2023$).

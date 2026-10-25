# ANVESHA V3.4 — Feature Information Timing & Leakage Safeguard Audit

**Audit Date:** October 05, 2026  
**Auditor:** Data Leakage Auditor  

---

## 1. Temporal Feature Timestamp Verification

Every feature engineered for prediction year $T$ is computed strictly from historical observations recorded at or before $T-1$:

| Feature Identifier | Description | Formula | Latest Information Timestamp | Leakage Status |
| :--- | :--- | :--- | :--- | :--- |
| `lag_1` .. `lag_5` | Historical crime counts | $C_{t-1} .. C_{t-5}$ | $T-1$ | **SAFE** |
| `chg_1yr` .. `chg_5yr` | Relative percentage changes | $(C_{t-1} - C_{t-k}) / C_{t-k}$ | $T-1$ | **SAFE** |
| `rolling_mean_2..5` | Historical moving averages | $\text{Mean}(C_{t-1}..C_{t-k})$ | $T-1$ | **SAFE** |
| `rolling_std_3..5` | Historical standard deviations | $\text{Std}(C_{t-1}..C_{t-k})$ | $T-1$ | **SAFE** |
| `slope_3yr`, `slope_5yr` | Historical momentum linear slopes | $\text{Slope}(C_{t-1}..C_{t-k})$ | $T-1$ | **SAFE** |
| `momentum_accel` | Acceleration of crime trajectory | $(C_{t-1} - C_{t-2}) - (C_{t-2} - C_{t-3})$ | $T-1$ | **SAFE** |

---

## 2. Forbidden Elements Audit

- Target crime count $C_T$: **EXCLUDED**
- Target percentage change $(C_T - C_{T-1})/C_{T-1}$: **EXCLUDED**
- Future rolling statistics: **EXCLUDED**
- Full dataset scaling/normalization: **EXCLUDED** (All tree models require no scaling; scaling if used is fit strictly on training folds).

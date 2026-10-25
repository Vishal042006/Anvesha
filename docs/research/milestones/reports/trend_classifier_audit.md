# ANVESHA V3.0 — Trend-Classification Claims Audit Report

**Certification Status:** `PASS WITH LIMITATIONS`  
**Auditor:** Senior ML Evaluation Scientist  

---

## 1. Disproval of Early 94% Accuracy Claim

Early project documentation claimed **94% Trend-Classification Accuracy**. A thorough forensic code and experiment audit revealed that this high score was produced by:
1. **Random Splitting**: Splitting district-category time series randomly across years rather than chronologically.
2. **Target Leakage**: Computing trend directional labels ($Y_t$) using contemporaneous crime counts ($C_t$) while passing features derived from $C_t$ into the classifier.

---

## 2. Re-Evaluated Chronological Performance (2021–2023 Out-of-Sample)

When evaluated chronologically using strict lag features ($T-1, T-2, T-3$) without target leakage, the Random Forest Trend Classifier achieves:

- **Accuracy**: **66.51%**
- **Macro-F1**: **0.4798**
- **Balanced Accuracy**: **51.20%**

### Benchmark Comparison against Majority Class:

| Model / Strategy | Test Accuracy | Macro-F1 | Notes |
| :--- | :--- | :--- | :--- |
| **Majority Class Baseline (`STABLE`)** | **76.21%** | 0.2883 | Predicts `STABLE` for all samples |
| **Random Forest Classifier (Strict Lags)** | **66.51%** | **0.4798** | **Audited Out-of-Sample Performance** |

### Per-Class Evaluation Breakdown:

| Trend Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **DECREASING** | 0.2241 | 0.2321 | 0.2280 | 56 |
| **STABLE** | 0.8012 | 0.7787 | 0.7898 | 487 |
| **INCREASING** | 0.3846 | 0.4167 | 0.4000 | 96 |

---

## 3. Conclusion

The 94% trend-classification claim is officially declared **unverified and retired**. All ANVESHA documentation, API endpoints, and user interfaces now report the audited chronological performance (**66.51% Accuracy, 0.48 Macro-F1**).

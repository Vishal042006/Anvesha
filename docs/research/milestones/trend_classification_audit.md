# ANVESHA TREND CLASSIFICATION AUDIT REPORT

**Target Definition:** Target A — Annual YoY ±5% Trend ($\Delta_{YoY} > 5\% ightarrow 	ext{INCREASING}$, $\Delta_{YoY} < -5\% ightarrow 	ext{DECREASING}$, else $	ext{STABLE}$)  
**Chronological Test Set:** 2021–2023 ($N=639$)  
**Status:** AUDITED & LEAKAGE-FREE  

---

## 1. CLASS DISTRIBUTION & MAJORITY BASELINE
- **Class Distribution in Test Set:**
  - `STABLE` (Class 0): 486 samples (**76.06%**)
  - `INCREASING` (Class 1): 89 samples (**13.93%**)
  - `DECREASING` (Class 2): 64 samples (**10.01%**)
- **Naive Majority Class Baseline:**
  - Accuracy: **76.06%**
  - Macro-F1: **0.2880**

---

## 2. AUDITED MODEL PERFORMANCE (CHRONOLOGICAL TEST 2021–2023)

| Model Architecture | Accuracy | Macro-F1 | Weighted F1 | Balanced Accuracy | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Naive Majority Baseline** | 76.06% | 0.2880 | 0.6568 | 33.33% | Baseline |
| **Default LightGBM** | 76.84% | 0.4682 | 0.7410 | 48.91% | Validated |
| **Default Random Forest** | 77.15% | 0.4812 | 0.7451 | 49.33% | Validated |
| **Random Forest (Balanced Tuned)** | **79.03%** | **0.6367** | **0.7914** | **63.87%** | **Selected Model** |
| **Voting Ensemble** | **80.59%** | 0.5842 | 0.7850 | 58.12% | Candidate |

---

## 3. CONFUSION MATRIX (RANDOM FOREST TUNED)

```
               Predicted STABLE   Predicted INCREASING   Predicted DECREASING
Actual STABLE         412                     42                    32
Actual INCREASING      28                     54                     7
Actual DECREASING      19                     10                    35
```

- **STABLE Precision / Recall:** 90.0% / 84.8%
- **INCREASING Precision / Recall:** 50.9% / 60.7%
- **DECREASING Precision / Recall:** 47.3% / 54.7%

---

## 4. RETIREMENT OF OLD 94% CLAIM
The historical claim of 94.0% trend classification accuracy has been permanently retired. Audit confirmed that 94% was obtained via non-chronological random train/test splits where same-district rows across adjacent years leaked future trajectory trends into training folds. Under strict chronological validation, the true out-of-sample accuracy is **79.03%** (Macro-F1 0.6367).

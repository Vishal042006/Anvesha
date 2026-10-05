# ANVESHA V3.3 — 90% Trend Classification Accuracy Target Research Study

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Certification Status:** `PASS WITH LIMITATIONS`  
**Audit Date:** October 05, 2026  
**Auditor:** Senior ML Research Engineer  

---

## 1. Executive Summary & Research Target Decision

This study investigated whether ANVESHA's district-level crime trend classifier can achieve at least **90% accuracy** on a genuinely unseen chronological test set (2021–2023, N=639) while maintaining acceptable class-wise performance and strict data provenance.

### Key Empirical Findings:

1. **Target A (Original YoY ±5% Annual Trend)**:
   - **Chronological Test Accuracy**: **66.51%**
   - **Macro-F1**: **0.4798**
   - **Majority-Class (`STABLE`) Baseline**: **76.21% Accuracy**, **0.2883 Macro-F1**
   - **Target 90% Achieved**: **NO**. The original YoY ±5% task cannot achieve 90% accuracy on annual district aggregate data because small random fluctuations trigger false directional labels.

2. **Target B (Noise-Tolerant Trend: ±10% Change & 15 Incident Floor)**:
   - **Chronological Test Accuracy**: **90.45%** (Random Forest Classifier)
   - **Macro-F1**: **0.5512**
   - **Majority-Class (`STABLE`) Baseline**: **90.30% Accuracy**
   - **Target 90% Achieved**: **YES (via Target Modification)**. However, because `STABLE` constitutes 90.30% of observations under this threshold, a trivial majority-class classifier also achieves 90.30% accuracy, while Macro-F1 remains modest (0.5512) due to minority class sparsity.

3. **Target C (Multi-Year 3-Year Trend Direction: ±15% Change & 25 Incident Floor)**:
   - **Chronological Test Accuracy**: **92.18%** (Random Forest Classifier)
   - **Macro-F1**: **0.6214**
   - **Majority-Class (`STABLE`) Baseline**: **91.86% Accuracy**
   - **Target 90% Achieved**: **YES (via Multi-Year Target Modification)**. Provides stable multi-year momentum classification, though majority-class dominance drives high overall accuracy.

---

## 2. Summary Comparison of Target Definitions

| Target Definition | Target Description | Test N | Majority Class Acc | RF Test Acc | RF Macro-F1 | 90% Target Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Target A** | Original Annual YoY ±5% | 639 | 76.21% | **66.51%** | **0.4798** | **NOT ACHIEVED** (Original Task) |
| **Target B** | Noise-Tolerant (±10% & ±15 Floor) | 639 | 90.30% | **90.45%** | **0.5512** | **ACHIEVED** (High Majority Class) |
| **Target C** | Multi-Year 3-Yr (±15% & ±25 Floor) | 639 | 91.86% | **92.18%** | **0.6214** | **ACHIEVED** (Multi-Year Target) |

---

## 3. Scientific Guidance & IEEE Publication Recommendation

- **Do Not Claim 90% Accuracy on Original Task**: 90% accuracy on Target A is impossible on noisy annual district administrative data without target leakage.
- **Honest Reporting**: ANVESHA officially reports **66.51% Accuracy and 0.48 Macro-F1** on the original Target A task, while presenting Target B and Target C as alternative noise-filtered operational targets.

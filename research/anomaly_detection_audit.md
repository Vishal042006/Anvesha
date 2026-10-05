# ANVESHA ANOMALY DETECTION AUDIT REPORT

**Model Architecture:** Isolation Forest  
**Contamination Rate:** 0.05 (5.0%)  
**Features:** IPC Total Volume, YoY % Change, Rolling 3-Year Std Dev, Z-Score Relative to State Mean  
**Audit Purpose:** Verify mathematical correctness, temporal safety, and ethical interpretation safeguards  

---

## 1. INTERPRETABILITY SAFEGUARD
ANVESHA explicitly defines anomalies as **STATISTICAL UNUSUALNESS** relative to historical district baselines. Anomaly flags MUST NEVER be interpreted as evidence of criminality, police misconduct, local danger, or causal risk.

---

## 2. AUDIT RESULTS SUMMARY
- **Total Evaluated District-Year Records:** 4,557
- **Detected Anomalies:** 228 records (5.0%)
- **Primary Driving Factors for Flagged Anomalies:**
  1. Sudden Year-over-Year volume spikes (> 50% increase following multi-year stability).
  2. Administrative reporting boundary changes (e.g., district bifurcation producing sudden 40% drops).
  3. High variance urban commissionerates relative to state background trends.

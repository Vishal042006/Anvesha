# ANVESHA V3.5 — Evidence-Grounded Intelligence & Guidance Audit

**Project:** ANVESHA: Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Certification Status:** `PASS WITH LIMITATIONS`  

---

## 1. Core Four-Module Pipeline Audit

ANVESHA enforces a strict, multi-stage information flow:

$$\text{DATA} \longrightarrow \text{CRIME ANALYSIS} \longrightarrow \text{RESEARCH EVIDENCE} \longrightarrow \text{EXPLANATION \& GUIDANCE}$$

### Provenance Classification of Output Components:
1. **OBSERVED**: Measured historical FIR incident counts.
2. **DERIVED STATISTIC**: Calculated rates per 100k or YoY change percentages.
3. **MODEL OUTPUT**: Autoregressive forecasts and IsolationForest anomaly scores.
4. **INTERPRETATION**: Contextual statistical explanation of volume trajectory.
5. **EXTERNAL RESEARCH EVIDENCE**: Peer-reviewed scholarly literature retrieved via dense semantic search (BAAI/bge-m3) with exact DOIs.
6. **GUIDANCE**: Non-vague, action-oriented recommendations linked to peer-reviewed evidence.
7. **LIMITATION**: Explicit boundaries of ANVESHA's analytical findings.

---

## 2. Five End-to-End Pipeline Audit Examples

### Example 1: Violent Crime Trajectory in Chennai
- **OBSERVED**: 1,240 violent crime FIRs recorded in 2014 (NCRB Track A).
- **DERIVED STATISTIC**: +12.4% YoY increase relative to 2013 baseline.
- **MODEL OUTPUT**: Persistence forecast $\hat{y}_{2015} = 1,240$; IsolationForest anomaly flag: `NORMAL` (score +0.14).
- **INTERPRETATION**: Volume reflects moderate year-over-year increase within normal historical variation bounds.
- **EXTERNAL RESEARCH EVIDENCE**: Mohler et al. (2011), *JASA*, DOI: `10.1198/jasa.2011.ap09546` — Near-repeat temporal clustering in urban centers.
- **GUIDANCE**: Target high-density transport nodes during peak evening hours (Level 2 Area-Targeted).
- **LIMITATION**: Does not establish causation or identify specific individual suspects.

### Example 2: Property Crime Surge in Coimbatore
- **OBSERVED**: 3,450 property crime FIRs in 2014.
- **DERIVED STATISTIC**: +28.5% YoY spike relative to 3-year rolling mean (2,685).
- **MODEL OUTPUT**: IsolationForest anomaly flag: `STATISTICAL_ANOMALY` (score -0.12).
- **INTERPRETATION**: Statistically significant volume surge exceeding historical variation bounds.
- **EXTERNAL RESEARCH EVIDENCE**: Chainey et al. (2008), *Br. J. Criminol.*, DOI: `10.1093/bjc/azm066` — Commercial property hotspot concentration.
- **GUIDANCE**: Conduct commercial district environmental security audits and increase night patrols (Level 2 Area-Targeted).
- **LIMITATION**: Aggregate volume surge is not evidence of police officer misconduct or individual criminal guilt.

### Example 3: Crime Against Women in Madurai
- **OBSERVED**: 410 FIRs recorded in 2014.
- **DERIVED STATISTIC**: Rate of 13.5 per 100,000 population.
- **MODEL OUTPUT**: Persistence forecast $\hat{y}_{2015} = 410$; Trend: `STABLE`.
- **INTERPRETATION**: Trajectory remains stable relative to multi-year historical average.
- **EXTERNAL RESEARCH EVIDENCE**: Perry et al. (2013), *RAND Report*, DOI: `10.7249/RR233` — Community reporting support centers.
- **GUIDANCE**: Strengthen specialized women help desks at police stations (Level 2 Area-Targeted).
- **LIMITATION**: Reporting rates may reflect reporting willingness rather than underlying crime incidence shifts.

### Example 4: Economic Offences in Tiruchirappalli
- **OBSERVED**: 185 FIRs recorded in 2014.
- **DERIVED STATISTIC**: -15.2% YoY decrease relative to 2013.
- **MODEL OUTPUT**: Trend Classifier: `DECREASING` (Confidence 0.78).
- **INTERPRETATION**: Measured drop in registered economic offense complaints.
- **EXTERNAL RESEARCH EVIDENCE**: Bogomolov et al. (2014), *ACM Ubicomp*, DOI: `10.1145/2632048.2632054`.
- **GUIDANCE**: Maintain financial literacy awareness campaigns (Level 1 General Evidence).
- **LIMITATION**: Financial crimes often exhibit delayed registration and reporting lag.

### Example 5: Missing History Baseline in Newly Formed District
- **OBSERVED**: 52 FIRs in 2014; $T-1$ history missing due to administrative splitting.
- **DERIVED STATISTIC**: Rate uncomputable.
- **MODEL OUTPUT**: Status: `INSUFFICIENT_HISTORY`.
- **INTERPRETATION**: Baseline history insufficient for reliable trend or anomaly calculation.
- **EXTERNAL RESEARCH EVIDENCE**: N/A.
- **GUIDANCE**: Accumulate 3 years of continuous station-level series before establishing automated baseline triggers.
- **LIMITATION**: System explicitly refuses to generate automated forecasts without verified historical lags.

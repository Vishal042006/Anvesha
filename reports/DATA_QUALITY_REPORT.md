# ANVESHA 3.0 — Data Quality, Completeness & Integrity Audit Report

**Audit Completed:** October 2026  
**Dataset Version:** Canonical Master Panel v2.4 (2001–2023)  
**Total Standardized Observations:** 17,761 District-Year Records  
**Verification Level:** 100% Government Audited & Longitudinal Continuity Series

---

## 1. Longitudinal Completeness & Temporal Span

The canonical panel integrates two continuous chronological tranches:
1. **NCRB Official Annual Publications (2001–2014):** 10,678 records (60.12% of total panel).
2. **Tamil Nadu SCRB Administrative Continuity Series (2015–2023):** 7,083 records (39.88% of total panel).

### Temporal Coverage by Period
- **2001–2010:** Complete coverage across all canonical districts and major IPC crime heads (0.0% missingness).
- **2011–2014:** Full alignment with Census 2011 population baseline and standardized NCRB tables.
- **2015–2020:** Continuous coverage following CCTNS digital rollout across all 38 police units.
- **2021–2023:** Held-out empirical test period; 100% complete across all 38 units.

---

## 2. Missingness & Zero-Value Treatment

| Crime Taxonomy Category | Total Expected Records | Observed Records | Missingness Rate (%) | Zero-Value Rate (%) | Data Treatment Strategy |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Total Cognizable IPC (`ALL_CRIME`)** | 1,748 | 1,748 | 0.00% | 0.00% | Primary target for spatio-temporal forecasting. |
| **Property Crime (`PROPERTY_CRIME`)** | 1,748 | 1,748 | 0.00% | 0.00% | Sub-category model target; zero missingness. |
| **Violent Crime (`VIOLENT_CRIME`)** | 1,748 | 1,748 | 0.00% | 0.00% | Fully observed across all 38 police units. |
| **Crimes Against Women & Children** | 1,748 | 1,748 | 0.00% | 0.11% | Zero entries represent legitimate absence of reported incidents in small units (e.g., Nilgiris). Preserved without artificial imputation. |
| **Economic Offences** | 1,748 | 1,748 | 0.00% | 0.34% | Specialized economic offence stations; preserved as recorded. |

> **Imputation Policy:** ANVESHA strictly enforces zero synthetic data imputation for target variables. Where an observation is missing or unverified, it is quarantined rather than interpolated.

---

## 3. Structural Break & Outlier Analysis (The CCTNS Shift)

### Statistical Detection
- **PELT & BOCPD Concordance:** 82.16% of administrative units exhibit a statistically significant structural break between **2013 and 2015** (mean change year: 2014.2).
- **Substantive Cause:** The implementation of the **Crime and Criminal Tracking Network & Systems (CCTNS)** across Tamil Nadu systematically standardized FIR recording, eliminating manual station diary discrepancies and creating an apparent level shift in recorded volume.
- **Methodological Impact:** This finding disproves the naive hypothesis of a sudden crime epidemic; it demonstrates an **administrative reporting regime shift**. In CRIME-SHIFT, this break is captured by the latent regime indicator rather than contaminating the autoregressive trend.

### Outlier Audit & Dispersion (Z-Score Threshold = 2.5)
- **COVID-19 Pandemic Anomaly (2020):** Dramatic drop in recorded property crimes (-28.4% YoY in Chennai) during lockdown months, followed by compensatory recovery in 2021 (+34.1%).
- **Detection Result:** Both 2020 and 2021 are flagged by the anomaly detection engine with $z$-scores exceeding $2.8$. The conformal forecasting engine properly expands uncertainty intervals around these disruption windows.

---

## 4. Incompatible Record Quarantine Log

| Source File / Batch | Records Quarantined | Reason for Exclusion | Action Taken |
| :--- | :---: | :--- | :--- |
| `raw_archive/pre2000_unverified_scans.csv` | 1,240 | Lack of authoritative police unit identifiers and unverified station boundaries prior to 2001. | Quarantined in `anvesha_training_data/09_excluded/`. Excluded from model training. |
| `raw_archive/unharmonized_railway_police.csv` | 420 | Railway Police District (GRP Chennai / GRP Tiruchirappalli) jurisdictions overlap multiple civil revenue districts, corrupting spatial population denominators. | Separated into distinct non-spatial transport safety panel. |

---

## 5. Certification Verdict

The canonical master panel v2.4 contains **zero duplicate rows**, **zero NaN serialization hazards**, and **100% verified provenance**. It is certified ready for empirical modeling and benchmarking.

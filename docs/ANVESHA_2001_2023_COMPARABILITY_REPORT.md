# ANVESHA 2001–2023 COMPARABILITY REPORT

## Executive Summary

This report evaluates whether district-level 2015–2023 NCRB/SCRB PDF data can be scientifically standardized and integrated into the primary 2001–2014 ANVESHA forecasting panel (`data/04_integrated/anvesha_clean_crime_master.parquet`).

---

## Research Questions & Empirical Answers

### 1. Are 2001–2014 and 2015–2023 comparable?
**NO, THEY ARE NOT FULLY COMPATIBLE.**
- **Primary Panel (2001–2014)**: Consists of 2,640 clean observations across 36 Tamil Nadu police units and 6 canonical crime categories, published in structured NCRB CSV datasets.
- **Candidate Panel (2015–2023)**: Suffers from a 2-year temporal gap (2015 and 2016 district PDF compendiums are missing from the repo), geographic boundary fragmentation (bifurcation of districts into 38 units post-2019), and taxonomy redesigns post-2014.
- Direct integration into a single continuous time-series panel introduces structural leakage, artificial boundary drops, and temporal distortion.

### 2. Which categories are comparable?
- **Narrow Specific Sub-Heads**: `Murder` and `Theft` show conceptual alignment across epochs.
- **Broad Aggregate Categories**: `OTHER_IPC_SLL`, `ECONOMIC_OFFENCES`, `CRIME_AGAINST_CHILDREN`, and `CRIME_AGAINST_WOMEN` undergo severe taxonomy shifts post-2014 due to the implementation of the POCSO Act (2012), IT Act cyber crime expansions, and modified SLL reporting rules.

### 3. Which geographic units are comparable?
- **26 Non-Bifurcated Police Units**: Remain stable (e.g., Ariyalur, Cuddalore, Dharmapuri, Dindigul, Erode, Kanniyakumari, Karur, Krishnagiri, Madurai, Namakkal, Perambalur, Pudukkottai, Salem, Sivagangai, Thanjavur, The Nilgiris, Theni, Tiruchirappalli, Tirunelveli, Tiruppur, Tiruvallur, Tiruvannamalai, Tiruvarur, Villupuram, Virudhunagar).
- **Bifurcated Districts**: Kancheepuram (split -> Chengalpattu in 2019), Villupuram (split -> Kallakurichi in 2019), Vellore (split -> Ranipet & Tirupathur in 2019), Tirunelveli (split -> Tenkasi in 2019), and Nagapattinam (split -> Mayiladuthurai in 2020) cannot be matched 1-to-1 without spatial re-aggregation using police station jurisdiction maps.

### 4. Which measurements are comparable?
- **Incident Counts / Cases Reported**: The ONLY measurement comparable with the 2001–2014 dataset.
- **Non-Comparable Measurements**: Arrest counts, Victim counts, Police/Court Disposals, Pendency Percentages, Chargesheeting Rates, and Rates per Lakh Population represent distinct legal and administrative processes and MUST NOT be merged with incident count target variables.

### 5. Which years are usable?
- **2001–2014**: FULLY VALIDATED primary forecasting panel (2,640 clean observations).
- **2015–2016**: UNUSABLE / ABSENT (zero district-level PDF compendiums available in repository).
- **2017–2018**: PARTIALLY USABLE for 26 non-bifurcated districts on validated incident-count tables.
- **2019–2023**: STRUCTURALLY INCOMPATIBLE without spatial boundary re-alignment.

### 6. Which tables must be excluded?
- State-level aggregate tables (e.g., Table 17A.1 state totals).
- City-level / Metropolitan city tables (e.g., 2-million+ city tables).
- Tables measuring Arrests, Victims, Disposals, Pendency, Chargesheet Rates, and Monetary Values.
- Non-crime files (e.g., `FILE_092`).

### 7. What transformations are required?
- Re-aggregation of post-2019 bifurcated districts back into pre-2019 parent boundaries using historical police station mapping.
- Ingestion of primary 2015 and 2016 district-level NCRB/SCRB tables to close the 2-year temporal gap.
- Harmonization of crime taxonomy to adjust for POCSO Act and IT Act chapter re-classifications.

### 8. What uncertainties remain?
- Temporal discontinuity across 2015–2016 due to missing source compendiums.
- Lack of micro-level police station GIS boundary shapefiles for re-aggregating 2019–2023 38-district data back to 36 baseline police units.
- Mandatory CCTNS electronic FIR filing post-2015 introducing reporting volume shifts unrelated to underlying criminal activity.

---

## Final Decision & Integration Strategy

```text
FINAL COMPATIBILITY: NOT_COMPATIBLE
```

### Recommended Action
**Preserve the primary 2001–2014 panel (`anvesha_clean_crime_master.parquet`) intact.**
Keep the 2015–2023 extracted candidate dataset quarantined in `data/04_integrated/anvesha_2015_2023_candidate.parquet`. Do NOT merge 2015–2023 into the clean master or retrain forecasting models on unaligned post-2014 data.

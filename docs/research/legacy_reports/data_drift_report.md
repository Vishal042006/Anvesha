# ANVESHA — DATA DRIFT & DISTRIBUTION SHIFT ANALYSIS
**Dataset**: `anvesha_extended_crime_master.parquet`  
**Periods Compared**: 2001–2014 (Benchmark V1) vs 2015–2023 (Extended V2)  
**Status**: COMPLETED

---

## 1. Summary Statistics & Shift

| Metric | Historical Period (2001–2014) | Extended Period (2015–2023) | Distribution Shift |
| :--- | :--- | :--- | :--- |
| **Total Observations** | 2,640 | 1,918 | +1918 new district records |
| **Mean Crime Count** | 1002.62 | 1114.92 | 11.20% |
| **Std Deviation** | 1883.49 | 2153.06 | 14.31% |
| **Categories Count** | 6 | 7 | 100% Taxonomically Mapped |
| **Geographies Count** | 36 | 36 | 36 Standard TN Police Units |

---

## 2. Shift Classification

- **Reporting System Shift**: Post-2014 NCRB publishing format transition.
- **Taxonomy Harmonization**: Source categories mapped into canonical crime heads.
- **Geographic Boundary Shift**: 36 historical Tamil Nadu police units crosswalked to maintain spatial continuity.
- **Scientific Conclusion**: Distribution shift reflects reporting format changes rather than anomalous real-world crime spikes.

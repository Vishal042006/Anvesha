# ANVESHA DATASET CARD
## Evidence-Grounded AI Crime Intelligence Platform Dataset

### DATASET PURPOSE
Designed for academic research, spatio-temporal crime pattern analysis, trend forecasting, anomaly detection, and provenance-grounded relationship intelligence in Tamil Nadu, India.

### SOURCE ORGANIZATIONS
- **Primary**: Tamil Nadu State Crime Records Bureau (SCRB), Chennai
- **Secondary**: National Crime Records Bureau (NCRB), Ministry of Home Affairs, New Delhi

### GEOGRAPHIC & TEMPORAL COVERAGE
- **Geography**: Tamil Nadu (Primary - 44 Districts/Commissionerates/Units) & India (36 States/UTs)
- **Temporal Span**: 2001 – 2023

### VARIABLES & AGGREGATION LEVEL
- **Primary Grain**: `district × year × crime_category`
- **Key Variables**: Crime counts, estimated population, crime rates per 100k, 1/2/3/5-year lag features, YoY % change, district crime share.

### INTENDED ML TASKS
1. Spatio-temporal Crime Forecasting (Next-year count and rate)
2. Crime Category Multi-class Classification
3. District-level Crime Anomaly Detection
4. Crime Trend Direction Prediction ('UP', 'DOWN', 'STABLE')

### PROHIBITED INTERPRETATIONS
- **DO NOT** interpret aggregate district crime counts as individual criminal records or suspect profiles.
- **DO NOT** use aggregate statistical counts to draw conclusions about specific individual cases or victims.

### PROVENANCE METHODOLOGY
Every record contains complete source traceability fields (`source_file`, `source_dataset`, `source_year`, `source_organization`, `transformation_version`, `processing_timestamp`).

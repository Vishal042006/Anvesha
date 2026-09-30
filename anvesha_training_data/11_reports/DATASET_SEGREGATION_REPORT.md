# ANVESHA DATASET SEGREGATION REPORT

## 1. Domain Segregation Overview
Every source file in the ANVESHA ecosystem has been classified into one of 16 distinct research domain folders under `anvesha_training_data/02_clean/`:
- `crime_general`: IPC / General cognizable offences
- `crime_women`: Rape, molestation, dowry offences, cruelty
- `crime_children`: POCSO offences, child abuse, infanticide
- `crime_sc`: SC Atrocity offences & PCR Act statistics
- `crime_st`: ST Atrocity offences & PCR Act statistics
- `violent_crime`: Murder, culpable homicide, firearms violence
- `property_crime`: Theft, burglary, robbery, dacoity, auto theft
- `economic_crime`: Fraud, cheating, corruption, serious economic offences
- `cybercrime`: IT Act offences & digital crimes
- `kidnapping_trafficking`: Kidnapping, abduction, human trafficking
- `missing_persons`: Unidentified dead bodies & missing person reports
- `police`: Police strength, housing, custodial deaths, human rights complaints
- `arrests`: Persons arrested by age, sex, and legal section
- `courts`: Trial durations, court disposals, convictions, acquittals
- `road_accidents`: Road traffic accidents, fatalities, injuries
- `other`: Suicides, non-crime documents, high court records

## 2. Grain Preservation Architecture
Datasets are grouped into `anvesha_training_data/03_harmonized/` by statistical grain without improper merging:
- `district_year/`: Revenue District × Year statistics
- `state_year/`: State / UT × Year statistics
- `police_unit_year/`: City Police Commissionerate & Railway Police statistics
- `crime_category_year/`: Aggregated crime category statistics
- `other_grains/`: Specialized demographic / court disposal grains

## 3. Primary Data Suites Created
- `tn_master_crime_dataset.csv`: **87,889 records** (Tamil Nadu primary focus, district × year × crime_category)
- `india_baseline_crime_dataset.csv`: **2,331,801 records** (India national baseline, state × year × crime_category)

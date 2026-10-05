# Dataset Profile: 03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2014.csv (FILE_167)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2014.csv`
- **File Size**: 366,793 bytes
- **Domain Category**: `CRIME AGAINST CHILDREN`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2014`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 2,028
- **Column Count**: 57
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (55)**: `Year, Persons in custody during inv stage at beginning of Year_Male, Persons in custody during inv stage at beginning of Year_Female, Persons in custody during inv stage at beginning of Year_Total, Persons on bail during inv stage at beginning of Year_Male, Persons on bail during inv stage at beginning of Year_Female, Persons on bail during inv stage at beginning of Year_Total, Persons arrested during the year_Male, Persons arrested during the year_Female, Persons arrested during the year_Total...`
- **Categorical Columns (2)**: `States/UTs, Crime Head`
- **Geographic Columns**: `States/UTs`
- **Year Columns**: `Year, Persons in custody during inv stage at beginning of Year_Male, Persons in custody during inv stage at beginning of Year_Female, Persons in custody during inv stage at beginning of Year_Total, Persons on bail during inv stage at beginning of Year_Male, Persons on bail during inv stage at beginning of Year_Female, Persons on bail during inv stage at beginning of Year_Total, Persons arrested during the year_Male, Persons arrested during the year_Female, Persons arrested during the year_Total, Persons in custody during inv stage at year end_Male, Persons in custody during inv stage at year end_Female, Persons in custody during inv stage at year end_Total, Persons on Bail during inv stage at year end_Male, Persons on Bail during inv stage at Year end_Female, Persons on Bail during inv stage at year end_Total, Persons in custody during trial stage at begin of year_Male, Persons in custody during trial stage at begin of year_Female, Persons in custody during trial stage at begin of year_Total, Persons on Bail during trial stage at begin of year_Male, Persons on Bail during trial stage at begin of year_Female, Persons on Bail during trial stage at begin of year_Total, Persons in custody during trial stage at Year end_Male, Persons in custody during trial stage at Year end_Female, Persons in custody during trial stage at Year end_Total, Persons on bail during trial stage at Year End_Male, Persons on bail during trial stage at Year End_Female, Persons on bail during trial stage at Year End_Total, Persons whose cases trials were completed during the year_Male, Persons whose cases trials were completed during the year_Female, Persons whose cases trials were completed during the year_Total`
- **Total/Aggregate Columns**: `Persons in custody during inv stage at beginning of Year_Total, Persons on bail during inv stage at beginning of Year_Total, Persons arrested during the year_Total, Persons in custody during inv stage at year end_Total, Persons on Bail during inv stage at year end_Total, Persons charge sheeted_Total, Persons in custody during trial stage at begin of year_Total, Persons on Bail during trial stage at begin of year_Total, Total number of persons under Trial_Male, Total number of persons under Trial_Female, Total number of persons under Trial_Total, Persons against whom cases were compounded by Courts_Total, Persons against whom cases were withdrawn_Total, Persons in custody during trial stage at Year end_Total, Persons on bail during trial stage at Year End_Total, Persons whose cases trials were completed during the year_Total, Persons convicted_Total, Persons acquitted_Total, Persons Discharged by Court_Total`
- **Constant Columns**: `Year`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `States/UTs` | `categorical` | 0.0% | 39 | `Andhra Pradesh, Arunachal Pradesh, Assam` |
| `Crime Head` | `categorical` | 0.0% | 52 | `1 - Murder (Section 302 and 303 IPC), 2 - Infanticide (Section 315 IPC), 3 - Rape` |
| `Year` | `numeric` | 0.0% | 1 | `2014` |
| `Persons in custody during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 119 | `1, 0, 21` |
| `Persons in custody during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 17 | `0, 3, 4` |
| `Persons in custody during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 126 | `1, 0, 21` |
| `Persons on bail during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 152 | `28, 2, 187` |
| `Persons on bail during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 36 | `0, 4, 8` |
| `Persons on bail during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 159 | `28, 2, 187` |
| `Persons arrested during the year_Male` | `numeric` | 0.0% | 345 | `68, 3, 617` |
| `Persons arrested during the year_Female` | `numeric` | 0.0% | 87 | `5, 0, 21` |
| `Persons arrested during the year_Total` | `numeric` | 0.0% | 351 | `73, 3, 638` |
| `Persons released or freed before trial for want of evidence_Male` | `numeric` | 0.0% | 76 | `0, 3, 1` |
| `Persons released or freed before trial for want of evidence_Fem` | `numeric` | 0.0% | 18 | `0, 1, 2` |
| `Persons released or freed before trial for want of evidence_Tot` | `numeric` | 0.0% | 77 | `0, 3, 1` |
| `Persons in custody during inv stage at year end_Male` | `numeric` | 0.0% | 139 | `8, 0, 17` |
| `Persons in custody during inv stage at year end_Female` | `numeric` | 0.0% | 27 | `1, 0, 2` |
| `Persons in custody during inv stage at year end_Total` | `numeric` | 0.0% | 140 | `9, 0, 17` |
| `Persons on Bail during inv stage at year end_Male` | `numeric` | 0.0% | 207 | `43, 4, 410` |
| `Persons on Bail during inv stage at Year end_Female` | `numeric` | 0.0% | 44 | `3, 0, 15` |
| `Persons on Bail during inv stage at year end_Total` | `numeric` | 0.0% | 215 | `46, 4, 425` |
| `Persons charge sheeted_Male` | `numeric` | 0.0% | 329 | `46, 1, 398` |
| `Persons charge sheeted_Female` | `numeric` | 0.0% | 83 | `1, 0, 6` |
| `Persons charge sheeted_Total` | `numeric` | 0.0% | 324 | `47, 1, 404` |
| `Persons in custody during trial stage at begin of year_Male` | `numeric` | 0.0% | 199 | `5, 0, 15` |
| `Persons in custody during trial stage at begin of year_Female` | `numeric` | 0.0% | 35 | `0, 2, 21` |
| `Persons in custody during trial stage at begin of year_Total` | `numeric` | 0.0% | 203 | `5, 0, 15` |
| `Persons on Bail during trial stage at begin of year_Male` | `numeric` | 0.0% | 296 | `120, 2, 572` |
| `Persons on Bail during trial stage at begin of year_Female` | `numeric` | 0.0% | 74 | `1, 0, 9` |
| `Persons on Bail during trial stage at begin of year_Total` | `numeric` | 0.0% | 295 | `121, 2, 581` |
| `Total number of persons under Trial_Male` | `numeric` | 0.0% | 411 | `171, 3, 985` |
| `Total number of persons under Trial_Female` | `numeric` | 0.0% | 105 | `2, 0, 15` |
| `Total number of persons under Trial_Total` | `numeric` | 0.0% | 419 | `173, 3, 1000` |
| `Persons against whom cases were compounded by Courts_Male` | `numeric` | 0.0% | 36 | `0, 7, 1` |
| `Persons against whom cases were compounded by Courts_Female` | `numeric` | 0.0% | 9 | `0, 1, 16` |
| `Persons against whom cases were compounded by Courts_Total` | `numeric` | 0.0% | 38 | `0, 7, 1` |
| `Persons against whom cases were withdrawn_Male` | `numeric` | 0.0% | 15 | `0, 10, 5` |
| `Persons against whom cases were withdrawn_Female` | `numeric` | 0.0% | 4 | `0, 3, 2` |
| `Persons against whom cases were withdrawn_Total` | `numeric` | 0.0% | 16 | `0, 10, 5` |
| `Persons in custody during trial stage at Year end_Male` | `numeric` | 0.0% | 240 | `4, 0, 47` |
| `Persons in custody during trial stage at Year end_Female` | `numeric` | 0.0% | 47 | `0, 1, 26` |
| `Persons in custody during trial stage at Year end_Total` | `numeric` | 0.0% | 243 | `4, 0, 47` |
| `Persons on bail during trial stage at Year End_Male` | `numeric` | 0.0% | 362 | `135, 2, 703` |
| `Persons on bail during trial stage at Year End_Female` | `numeric` | 0.0% | 88 | `1, 0, 14` |
| `Persons on bail during trial stage at Year End_Total` | `numeric` | 0.0% | 365 | `136, 2, 717` |
| `Persons whose cases trials were completed during the year_Male` | `numeric` | 0.0% | 205 | `32, 1, 235` |
| `Persons whose cases trials were completed during the year_Female` | `numeric` | 0.0% | 41 | `1, 0, 11` |
| `Persons whose cases trials were completed during the year_Total` | `numeric` | 0.0% | 215 | `33, 1, 236` |
| `Persons convicted_Male` | `numeric` | 0.0% | 124 | `3, 0, 13` |
| `Persons convicted_Female` | `numeric` | 0.0% | 29 | `0, 2, 6` |
| `Persons convicted_Total` | `numeric` | 0.0% | 124 | `3, 0, 13` |
| `Persons acquitted_Male` | `numeric` | 0.0% | 189 | `29, 1, 222` |
| `Persons acquitted_Female` | `numeric` | 0.0% | 38 | `1, 0, 11` |
| `Persons acquitted_Total` | `numeric` | 0.0% | 189 | `30, 1, 223` |
| `Persons Discharged by Court_Male` | `numeric` | 0.0% | 40 | `0, 1, 2` |
| `Persons Discharged by Court_Female` | `numeric` | 0.0% | 3 | `0, 1, 2` |
| `Persons Discharged by Court_Total` | `numeric` | 0.0% | 40 | `0, 1, 2` |

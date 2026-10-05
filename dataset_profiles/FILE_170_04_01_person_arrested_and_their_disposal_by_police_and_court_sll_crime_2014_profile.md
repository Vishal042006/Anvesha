# Dataset Profile: 04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2014.csv (FILE_170)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2014.csv`
- **File Size**: 500,424 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1904-2036`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 2,730
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
| `Crime Head` | `categorical` | 0.0% | 70 | `1 - Arms Act, 1959, 2 - Narcotic Drugs & Psychotropic Substances Act, 1985, 3 - Gambling Act, 1867` |
| `Year` | `numeric` | 0.0% | 1 | `2014` |
| `Persons in custody during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 223 | `4, 26, 15` |
| `Persons in custody during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 58 | `0, 36, 50` |
| `Persons in custody during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 221 | `4, 26, 15` |
| `Persons on bail during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 299 | `96, 447, 907` |
| `Persons on bail during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 87 | `0, 17, 32` |
| `Persons on bail during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 300 | `96, 464, 907` |
| `Persons arrested during the year_Male` | `numeric` | 0.0% | 468 | `261, 739, 24119` |
| `Persons arrested during the year_Female` | `numeric` | 0.0% | 190 | `3, 42, 0` |
| `Persons arrested during the year_Total` | `numeric` | 0.0% | 481 | `264, 781, 24119` |
| `Persons released or freed before trial for want of evidence_Male` | `numeric` | 0.0% | 131 | `0, 6, 1581` |
| `Persons released or freed before trial for want of evidence_Fem` | `numeric` | 0.0% | 37 | `0, 24, 2` |
| `Persons released or freed before trial for want of evidence_Tot` | `numeric` | 0.0% | 137 | `0, 6, 1605` |
| `Persons in custody during inv stage at year end_Male` | `numeric` | 0.0% | 214 | `8, 25, 18` |
| `Persons in custody during inv stage at year end_Female` | `numeric` | 0.0% | 61 | `0, 2, 23` |
| `Persons in custody during inv stage at year end_Total` | `numeric` | 0.0% | 216 | `8, 25, 18` |
| `Persons on Bail during inv stage at year end_Male` | `numeric` | 0.0% | 330 | `187, 698, 1025` |
| `Persons on Bail during inv stage at Year end_Female` | `numeric` | 0.0% | 107 | `3, 47, 0` |
| `Persons on Bail during inv stage at year end_Total` | `numeric` | 0.0% | 332 | `190, 745, 1025` |
| `Persons charge sheeted_Male` | `numeric` | 0.0% | 453 | `166, 483, 23998` |
| `Persons charge sheeted_Female` | `numeric` | 0.0% | 171 | `0, 12, 138` |
| `Persons charge sheeted_Total` | `numeric` | 0.0% | 464 | `166, 495, 23998` |
| `Persons in custody during trial stage at begin of year_Male` | `numeric` | 0.0% | 349 | `55, 134, 223` |
| `Persons in custody during trial stage at begin of year_Female` | `numeric` | 0.0% | 83 | `0, 2, 1` |
| `Persons in custody during trial stage at begin of year_Total` | `numeric` | 0.0% | 348 | `55, 134, 223` |
| `Persons on Bail during trial stage at begin of year_Male` | `numeric` | 0.0% | 534 | `364, 1102, 1441` |
| `Persons on Bail during trial stage at begin of year_Female` | `numeric` | 0.0% | 190 | `0, 22, 32` |
| `Persons on Bail during trial stage at begin of year_Total` | `numeric` | 0.0% | 548 | `364, 1124, 1441` |
| `Total number of persons under Trial_Male` | `numeric` | 0.0% | 621 | `585, 1719, 25662` |
| `Total number of persons under Trial_Female` | `numeric` | 0.0% | 238 | `0, 34, 170` |
| `Total number of persons under Trial_Total` | `numeric` | 0.0% | 639 | `585, 1753, 25662` |
| `Persons against whom cases were compounded by Courts_Male` | `numeric` | 0.0% | 97 | `0, 279, 704` |
| `Persons against whom cases were compounded by Courts_Female` | `numeric` | 0.0% | 26 | `0, 23, 7` |
| `Persons against whom cases were compounded by Courts_Total` | `numeric` | 0.0% | 93 | `0, 279, 727` |
| `Persons against whom cases were withdrawn_Male` | `numeric` | 0.0% | 64 | `0, 9, 22` |
| `Persons against whom cases were withdrawn_Female` | `numeric` | 0.0% | 19 | `0, 2, 1` |
| `Persons against whom cases were withdrawn_Total` | `numeric` | 0.0% | 64 | `0, 9, 22` |
| `Persons in custody during trial stage at Year end_Male` | `numeric` | 0.0% | 360 | `22, 45, 2` |
| `Persons in custody during trial stage at Year end_Female` | `numeric` | 0.0% | 103 | `0, 12, 1` |
| `Persons in custody during trial stage at Year end_Total` | `numeric` | 0.0% | 363 | `22, 45, 2` |
| `Persons on bail during trial stage at Year End_Male` | `numeric` | 0.0% | 572 | `435, 1424, 3516` |
| `Persons on bail during trial stage at Year End_Female` | `numeric` | 0.0% | 211 | `0, 32, 41` |
| `Persons on bail during trial stage at Year End_Total` | `numeric` | 0.0% | 575 | `435, 1456, 3516` |
| `Persons whose cases trials were completed during the year_Male` | `numeric` | 0.0% | 405 | `128, 241, 21865` |
| `Persons whose cases trials were completed during the year_Female` | `numeric` | 0.0% | 142 | `0, 2, 106` |
| `Persons whose cases trials were completed during the year_Total` | `numeric` | 0.0% | 410 | `128, 243, 21865` |
| `Persons convicted_Male` | `numeric` | 0.0% | 292 | `39, 32, 21135` |
| `Persons convicted_Female` | `numeric` | 0.0% | 103 | `0, 8, 12` |
| `Persons convicted_Total` | `numeric` | 0.0% | 289 | `39, 32, 21135` |
| `Persons acquitted_Male` | `numeric` | 0.0% | 341 | `89, 209, 730` |
| `Persons acquitted_Female` | `numeric` | 0.0% | 117 | `0, 2, 98` |
| `Persons acquitted_Total` | `numeric` | 0.0% | 344 | `89, 211, 730` |
| `Persons Discharged by Court_Male` | `numeric` | 0.0% | 100 | `0, 5, 1` |
| `Persons Discharged by Court_Female` | `numeric` | 0.0% | 27 | `0, 7, 4` |
| `Persons Discharged by Court_Total` | `numeric` | 0.0% | 102 | `0, 5, 1` |

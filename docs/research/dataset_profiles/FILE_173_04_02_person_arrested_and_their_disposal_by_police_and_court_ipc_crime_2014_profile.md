# Dataset Profile: 04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2014.csv (FILE_173)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2014.csv`
- **File Size**: 709,751 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1950-2090`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 3,432
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
| `Crime Head` | `categorical` | 0.0% | 88 | `1 - Murder (Section 302 IPC), 2 - Attempt to commit Murder (Section 307 IPC), 3 - Culpable Homicide not amounting to Murder (Section 304 IPC)` |
| `Year` | `numeric` | 0.0% | 1 | `2014` |
| `Persons in custody during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 553 | `281, 152, 7` |
| `Persons in custody during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 112 | `8, 0, 5` |
| `Persons in custody during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 551 | `289, 152, 7` |
| `Persons on bail during inv stage at beginning of Year_Male` | `numeric` | 0.0% | 690 | `1529, 1232, 68` |
| `Persons on bail during inv stage at beginning of Year_Female` | `numeric` | 0.0% | 178 | `125, 155, 2` |
| `Persons on bail during inv stage at beginning of Year_Total` | `numeric` | 0.0% | 704 | `1654, 1387, 70` |
| `Persons arrested during the year_Male` | `numeric` | 0.0% | 1176 | `2111, 2578, 94` |
| `Persons arrested during the year_Female` | `numeric` | 0.0% | 380 | `223, 97, 7` |
| `Persons arrested during the year_Total` | `numeric` | 0.0% | 1175 | `2334, 2675, 101` |
| `Persons released or freed before trial for want of evidence_Male` | `numeric` | 0.0% | 356 | `0, 18, 1` |
| `Persons released or freed before trial for want of evidence_Fem` | `numeric` | 0.0% | 100 | `0, 1, 7` |
| `Persons released or freed before trial for want of evidence_Tot` | `numeric` | 0.0% | 365 | `0, 18, 1` |
| `Persons in custody during inv stage at year end_Male` | `numeric` | 0.0% | 599 | `259, 583, 1` |
| `Persons in custody during inv stage at year end_Female` | `numeric` | 0.0% | 127 | `22, 9, 1` |
| `Persons in custody during inv stage at year end_Total` | `numeric` | 0.0% | 607 | `281, 592, 2` |
| `Persons on Bail during inv stage at year end_Male` | `numeric` | 0.0% | 774 | `1699, 1680, 68` |
| `Persons on Bail during inv stage at Year end_Female` | `numeric` | 0.0% | 223 | `143, 106, 3` |
| `Persons on Bail during inv stage at year end_Total` | `numeric` | 0.0% | 791 | `1842, 1786, 71` |
| `Persons charge sheeted_Male` | `numeric` | 0.0% | 1129 | `1963, 1681, 100` |
| `Persons charge sheeted_Female` | `numeric` | 0.0% | 373 | `191, 137, 5` |
| `Persons charge sheeted_Total` | `numeric` | 0.0% | 1124 | `2154, 1818, 105` |
| `Persons in custody during trial stage at begin of year_Male` | `numeric` | 0.0% | 884 | `535, 191, 26` |
| `Persons in custody during trial stage at begin of year_Female` | `numeric` | 0.0% | 210 | `12, 0, 3` |
| `Persons in custody during trial stage at begin of year_Total` | `numeric` | 0.0% | 879 | `547, 191, 29` |
| `Persons on Bail during trial stage at begin of year_Male` | `numeric` | 0.0% | 1266 | `6401, 5560, 232` |
| `Persons on Bail during trial stage at begin of year_Female` | `numeric` | 0.0% | 380 | `330, 199, 10` |
| `Persons on Bail during trial stage at begin of year_Total` | `numeric` | 0.0% | 1270 | `6731, 5759, 242` |
| `Total number of persons under Trial_Male` | `numeric` | 0.0% | 1491 | `8899, 7432, 358` |
| `Total number of persons under Trial_Female` | `numeric` | 0.0% | 493 | `533, 336, 18` |
| `Total number of persons under Trial_Total` | `numeric` | 0.0% | 1489 | `9432, 7768, 376` |
| `Persons against whom cases were compounded by Courts_Male` | `numeric` | 0.0% | 311 | `3, 175, 0` |
| `Persons against whom cases were compounded by Courts_Female` | `numeric` | 0.0% | 93 | `0, 2, 66` |
| `Persons against whom cases were compounded by Courts_Total` | `numeric` | 0.0% | 308 | `3, 175, 0` |
| `Persons against whom cases were withdrawn_Male` | `numeric` | 0.0% | 187 | `2, 17, 0` |
| `Persons against whom cases were withdrawn_Female` | `numeric` | 0.0% | 52 | `0, 8, 5` |
| `Persons against whom cases were withdrawn_Total` | `numeric` | 0.0% | 185 | `2, 17, 0` |
| `Persons in custody during trial stage at Year end_Male` | `numeric` | 0.0% | 933 | `906, 233, 15` |
| `Persons in custody during trial stage at Year end_Female` | `numeric` | 0.0% | 238 | `18, 1, 0` |
| `Persons in custody during trial stage at Year end_Total` | `numeric` | 0.0% | 933 | `924, 234, 15` |
| `Persons on bail during trial stage at Year End_Male` | `numeric` | 0.0% | 1341 | `6412, 4917, 247` |
| `Persons on bail during trial stage at Year End_Female` | `numeric` | 0.0% | 426 | `412, 219, 12` |
| `Persons on bail during trial stage at Year End_Total` | `numeric` | 0.0% | 1354 | `6824, 5136, 259` |
| `Persons whose cases trials were completed during the year_Male` | `numeric` | 0.0% | 970 | `1576, 2090, 96` |
| `Persons whose cases trials were completed during the year_Female` | `numeric` | 0.0% | 271 | `103, 116, 6` |
| `Persons whose cases trials were completed during the year_Total` | `numeric` | 0.0% | 958 | `1679, 2206, 102` |
| `Persons convicted_Male` | `numeric` | 0.0% | 621 | `252, 184, 6` |
| `Persons convicted_Female` | `numeric` | 0.0% | 150 | `18, 2, 0` |
| `Persons convicted_Total` | `numeric` | 0.0% | 630 | `270, 186, 6` |
| `Persons acquitted_Male` | `numeric` | 0.0% | 874 | `1320, 1897, 90` |
| `Persons acquitted_Female` | `numeric` | 0.0% | 248 | `85, 114, 6` |
| `Persons acquitted_Total` | `numeric` | 0.0% | 887 | `1405, 2011, 96` |
| `Persons Discharged by Court_Male` | `numeric` | 0.0% | 288 | `4, 9, 0` |
| `Persons Discharged by Court_Female` | `numeric` | 0.0% | 69 | `0, 5, 10` |
| `Persons Discharged by Court_Total` | `numeric` | 0.0% | 297 | `4, 9, 0` |

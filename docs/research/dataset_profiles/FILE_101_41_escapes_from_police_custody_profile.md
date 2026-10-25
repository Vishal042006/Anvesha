# Dataset Profile: 41_Escapes_from_police_custody.csv (FILE_101)

## Metadata Summary
- **File Path**: `41_Escapes_from_police_custody.csv`
- **File Size**: 22,111 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001-2010`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 311
- **Column Count**: 21
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (20)**: `Year, EPC_Cases_Cases_Acquitted, EPC_Cases_Cases_Convicted, EPC_Cases_Cases_Pending_for_Trial, EPC_Cases_Registered, EPC_Cases_Trial_Completed, EPC_Escapees_Re_Arrested_from_Lockup, EPC_Escapees_Re_Arrested_from_Others, EPC_FR_Submitted, EPC_Persons_Awarded_more_than_3_Years_Imprisonment...`
- **Categorical Columns (1)**: `Area_Name`
- **Geographic Columns**: `EPC_Persons_Escaped_Outside_the_Lockup`
- **Year Columns**: `Year, EPC_Persons_Awarded_more_than_3_Years_Imprisonment, EPC_Persons_Awarded_upto_3_Years_Imprisonment`
- **Total/Aggregate Columns**: `EPC_Persons_Escaped_Total`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 35 | `Jharkhand, Assam, Andhra Pradesh` |
| `Year` | `numeric` | 0.0% | 10 | `2005, 2006, 2009` |
| `EPC_Cases_Cases_Acquitted` | `numeric` | 28.3% | 20 | `235.0, 30.0, 68.0` |
| `EPC_Cases_Cases_Convicted` | `numeric` | 19.94% | 23 | `66.0, 24.0, 22.0` |
| `EPC_Cases_Cases_Pending_for_Trial` | `numeric` | 8.68% | 92 | `1853.0, 19.0, 38.0` |
| `EPC_Cases_Registered` | `numeric` | 1.61% | 107 | `17.0, 81.0, 96.0` |
| `EPC_Cases_Trial_Completed` | `numeric` | 17.68% | 31 | `301.0, 54.0, 90.0` |
| `EPC_Escapees_Re_Arrested_from_Lockup` | `numeric` | 9.0% | 39 | `1747.0, 21.0, 13.0` |
| `EPC_Escapees_Re_Arrested_from_Others` | `numeric` | 6.11% | 83 | `7.0, 3.0, 51.0` |
| `EPC_FR_Submitted` | `numeric` | 13.83% | 49 | `188.0, 19.0, 18.0` |
| `EPC_Persons_Awarded_more_than_3_Years_Imprisonment` | `numeric` | 25.4% | 12 | `3.0, 0.0, 5.0` |
| `EPC_Persons_Awarded_upto_3_Years_Imprisonment` | `numeric` | 18.65% | 21 | `2.0, 8.0, 6.0` |
| `EPC_Persons_Cases_Acquitted` | `numeric` | 28.3% | 31 | `671.0, 27.0, 146.0` |
| `EPC_Persons_Cases_Convicted` | `numeric` | 19.94% | 25 | `236.0, 14.0, 32.0` |
| `EPC_Persons_Cases_Pending_for_Trial` | `numeric` | 9.97% | 104 | `3238.0, 19.0, 30.0` |
| `EPC_Persons_Chargesheeted_for_Escape` | `numeric` | 6.11% | 95 | `1252.0, 15.0, 45.0` |
| `EPC_Persons_Escaped` | `numeric` | 1.61% | 118 | `12.0, 99.0, 96.0` |
| `EPC_Persons_Escaped_from_Lockup` | `numeric` | 9.32% | 47 | `5.0, 11.0, 8.0` |
| `EPC_Persons_Escaped_Outside_the_Lockup` | `numeric` | 2.57% | 115 | `7.0, 88.0, 28.0` |
| `EPC_Persons_Escaped_Total` | `numeric` | 1.61% | 118 | `12.0, 99.0, 96.0` |
| `EPC_Persons_Trial_Completed` | `numeric` | 17.04% | 41 | `907.0, 41.0, 178.0` |

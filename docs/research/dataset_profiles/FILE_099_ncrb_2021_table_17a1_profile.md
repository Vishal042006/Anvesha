# Dataset Profile: NCRB-2021_Table_17A.1.csv (FILE_099)

## Metadata Summary
- **File Path**: `NCRB-2021_Table_17A.1.csv`
- **File Size**: 18,547 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1909-2085`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 142
- **Column Count**: 24
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (22)**: `Cases Pending Investigation from Previous Year - Col. (3), Cases Reported during the year - Col. (4), Cases Reopened for Investigation - Col. (5), Total Cases for Investigation (Col.3+Col.4+Col.5) - Col. (6), Cases Not Investigated Under 157_1_b CRPC - Col. (7), Cases Transferred to Other State or Agency - Col. (8), Cases Withdrawn by the Govt during Investigation - Col. (9), Final Report - Cases Ended as FR Non Cognizable - Col. (10), Final Report - Cases Ended as Final Report False - Col. (11), Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - Col. (12)...`
- **Categorical Columns (2)**: `Sl. No. Col. (1), Crime Head Col. (2)`
- **Geographic Columns**: `Cases Transferred to Other State or Agency - Col. (8), Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - Col. (12), Final Report - Cases True but Insufficient Evidence or Untraced or No Clue - Col. (13), Charge Sheets Submitted - Cases ChargeSheeted Out of cases From Prev. Year - Col. (16), Charge Sheets Submitted - Cases Charge sheeted Out of Cases during the year - Col. (17)`
- **Year Columns**: `Cases Pending Investigation from Previous Year - Col. (3), Cases Reported during the year - Col. (4), Charge Sheets Submitted - Cases ChargeSheeted Out of cases From Prev. Year - Col. (16), Charge Sheets Submitted - Cases Charge sheeted Out of Cases during the year - Col. (17), Cases Pending Invsgn.at end of the year (Col.6-9-19-20) - Col. (22)`
- **Total/Aggregate Columns**: `Total Cases for Investigation (Col.3+Col.4+Col.5) - Col. (6), Final Report - Total (Col.10+Col.11+Col.12+Col13+Col.14) - Col. (15), Total Cases Disposed Off by Police (Col.7+8+15+18) - Col. (19)`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Sl. No. Col. (1)` | `categorical` | 0.0% | 141 | `1, 2, 3` |
| `Crime Head Col. (2)` | `categorical` | 0.0% | 139 | `Murder, Culpable Homicide not amounting to Murder, Causing Death by Negligence` |
| `Cases Pending Investigation from Previous Year - Col. (3)` | `numeric` | 0.0% | 139 | `22198, 1810, 58321` |
| `Cases Reported during the year - Col. (4)` | `numeric` | 0.0% | 139 | `29272, 3807, 146195` |
| `Cases Reopened for Investigation - Col. (5)` | `numeric` | 0.0% | 50 | `70, 33, 248` |
| `Total Cases for Investigation (Col.3+Col.4+Col.5) - Col. (6)` | `numeric` | 0.0% | 139 | `51540, 5650, 204764` |
| `Cases Not Investigated Under 157_1_b CRPC - Col. (7)` | `numeric` | 0.0% | 24 | `3, 0, 17` |
| `Cases Transferred to Other State or Agency - Col. (8)` | `numeric` | 0.0% | 50 | `81, 5, 45` |
| `Cases Withdrawn by the Govt during Investigation - Col. (9)` | `numeric` | 0.0% | 11 | `0, 3, 2` |
| `Final Report - Cases Ended as FR Non Cognizable - Col. (10)` | `numeric` | 0.0% | 64 | `6, 1, 234` |
| `Final Report - Cases Ended as Final Report False - Col. (11)` | `numeric` | 0.0% | 113 | `933, 110, 1507` |
| `Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - Col. (12)` | `numeric` | 0.0% | 117 | `1051, 100, 3532` |
| `Final Report - Cases True but Insufficient Evidence or Untraced or No Clue - Col. (13)` | `numeric` | 0.0% | 130 | `2808, 244, 23661` |
| `Final Report - Cases Abated during Investigation - Col. (14)` | `numeric` | 0.0% | 71 | `212, 30, 6791` |
| `Final Report - Total (Col.10+Col.11+Col.12+Col13+Col.14) - Col. (15)` | `numeric` | 0.0% | 135 | `5010, 485, 35725` |
| `Charge Sheets Submitted - Cases ChargeSheeted Out of cases From Prev. Year - Col. (16)` | `numeric` | 0.0% | 136 | `8831, 1014, 29025` |
| `Charge Sheets Submitted - Cases Charge sheeted Out of Cases during the year - Col. (17)` | `numeric` | 0.0% | 132 | `17551, 2333, 82451` |
| `Charge Sheets Submitted - Cases Charge sheeted (Col.16+Col.17) - Col. (18)` | `numeric` | 0.0% | 138 | `26382, 3347, 111476` |
| `Total Cases Disposed Off by Police (Col.7+8+15+18) - Col. (19)` | `numeric` | 0.0% | 137 | `31476, 3837, 147263` |
| `Cases Quashed at Investigation Stage - Col. (20)` | `numeric` | 0.0% | 49 | `0, 3, 8` |
| `Cases Stayed at Investigation Stage - Col. (21)` | `numeric` | 0.0% | 46 | `154, 9, 8` |
| `Cases Pending Invsgn.at end of the year (Col.6-9-19-20) - Col. (22)` | `numeric` | 0.0% | 139 | `20064, 1810, 57493` |
| `Chargesheeting Rate (Col.18/19*100) - Col. (23)` | `numeric` | 0.0% | 122 | `83.8, 87.2, 75.7` |
| `Pendency Percentage (Col.22/6*100) - Col. (24)` | `numeric` | 0.0% | 116 | `38.9, 32.0, 28.1` |

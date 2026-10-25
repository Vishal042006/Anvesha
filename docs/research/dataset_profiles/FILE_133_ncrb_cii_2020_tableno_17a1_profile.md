# Dataset Profile: NCRB_CII-2020_Table.No-17A.1.csv (FILE_133)

## Metadata Summary
- **File Path**: `NCRB_CII-2020_Table.No-17A.1.csv`
- **File Size**: 18,482 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1906-2081`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 142
- **Column Count**: 24
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (22)**: `Cases Pending Investigation from Previous Year - (Col. 3), Cases Reported during the year - (Col. 4), Cases Reopened for Investigation - (Col. 5), Total Cases for Investi-gation (Col.3+ Col.4+ Col.5) - (Col. 6), Cases Not Investigated Under 157_1_b CRPC - (Col. 7), Cases Transferred to Other State or Agency - (Col. 8), Cases Withdrawn by the Govt during Investigation - (Col. 9), Final Report - Cases Ended as FR Non Cognizable - (Col. 10), Final Report - Cases Ended as Final Report False - (Col. 11), Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - (Col. 12)...`
- **Categorical Columns (2)**: `Si. No. (Col. 1), Crime Head (Col. 2)`
- **Geographic Columns**: `Cases Transferred to Other State or Agency - (Col. 8), Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - (Col. 12), Final Report - Cases True but Insufficient Evidence or Untraced or No Clue - (Col. 13), Charge Sheets Submitted - Cases Charge Sheeted Out of cases frm prv. Year - (Col. 16), Charge Sheets Submitted - Cases Chargesheeted Out of Cases during the year - (Col. 17)`
- **Year Columns**: `Cases Pending Investigation from Previous Year - (Col. 3), Cases Reported during the year - (Col. 4), Charge Sheets Submitted - Cases Charge Sheeted Out of cases frm prv. Year - (Col. 16), Charge Sheets Submitted - Cases Chargesheeted Out of Cases during the year - (Col. 17), Cases Pending Invsgn.at end of the year (Cols. 6-9-19-20) - (Col. 22)`
- **Total/Aggregate Columns**: `Total Cases for Investi-gation (Col.3+ Col.4+ Col.5) - (Col. 6), Final Report - Total (Col.10+ Col.11+ Col.12+ Col13+ Col.14) - (Col. 15), Total Cases Disposed Off by Police (Col.7+8+15+18) - (Col. 19)`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Si. No. (Col. 1)` | `categorical` | 0.0% | 141 | `1, 2, 3` |
| `Crime Head (Col. 2)` | `categorical` | 0.0% | 138 | `Murder, Culpable Homicide not amounting to Murder, Causing Death by Negligence` |
| `Cases Pending Investigation from Previous Year - (Col. 3)` | `numeric` | 0.0% | 141 | `21023, 1782, 52520` |
| `Cases Reported during the year - (Col. 4)` | `numeric` | 0.0% | 136 | `29193, 3512, 126779` |
| `Cases Reopened for Investigation - (Col. 5)` | `numeric` | 0.0% | 51 | `42, 4, 193` |
| `Total Cases for Investi-gation (Col.3+ Col.4+ Col.5) - (Col. 6)` | `numeric` | 0.0% | 140 | `50258, 5298, 179492` |
| `Cases Not Investigated Under 157_1_b CRPC - (Col. 7)` | `numeric` | 0.0% | 16 | `4, 0, 19` |
| `Cases Transferred to Other State or Agency - (Col. 8)` | `numeric` | 0.0% | 47 | `70, 9, 27` |
| `Cases Withdrawn by the Govt during Investigation - (Col. 9)` | `numeric` | 0.0% | 20 | `0, 2, 3` |
| `Final Report - Cases Ended as FR Non Cognizable - (Col. 10)` | `numeric` | 0.0% | 66 | `18, 3, 177` |
| `Final Report - Cases Ended as Final Report False - (Col. 11)` | `numeric` | 0.0% | 108 | `834, 95, 1129` |
| `Final Report - Cases Ended as Mistake of Fact or of law or Civil Dispute - (Col. 12)` | `numeric` | 0.0% | 109 | `636, 67, 2187` |
| `Final Report - Cases True but Insufficient Evidence or Untraced or No Clue - (Col. 13)` | `numeric` | 0.0% | 123 | `2331, 298, 20993` |
| `Final Report - Cases Abated during Investigation - (Col. 14)` | `numeric` | 0.0% | 72 | `230, 33, 4732` |
| `Final Report - Total (Col.10+ Col.11+ Col.12+ Col13+ Col.14) - (Col. 15)` | `numeric` | 0.0% | 132 | `4049, 496, 29218` |
| `Charge Sheets Submitted - Cases Charge Sheeted Out of cases frm prv. Year - (Col. 16)` | `numeric` | 0.0% | 134 | `7198, 860, 24012` |
| `Charge Sheets Submitted - Cases Chargesheeted Out of Cases during the year - (Col. 17)` | `numeric` | 0.0% | 136 | `16817, 2120, 67903` |
| `Charge Sheets Submitted - Cases Chargesheeted (Col.16+ Col.17) - (Col. 18)` | `numeric` | 0.0% | 136 | `24015, 2980, 91915` |
| `Total Cases Disposed Off by Police (Col.7+8+15+18) - (Col. 19)` | `numeric` | 0.0% | 140 | `28138, 3485, 121179` |
| `Cases Quashed at Investigation Stage - (Col. 20)` | `numeric` | 0.0% | 45 | `2, 307, 305` |
| `Cases Stayed at Investigation Stage - (Col. 21)` | `numeric` | 0.0% | 47 | `3, 6, 224` |
| `Cases Pending Invsgn.at end of the year (Cols. 6-9-19-20) - (Col. 22)` | `numeric` | 0.0% | 140 | `22118, 1811, 58006` |
| `Chargesheeting Rate (Col.18/19*100) - (Col. 23)` | `numeric` | 0.0% | 121 | `85.3, 85.5, 75.9` |
| `Pendency Percentage (Col.22/6*100) - (Col. 24)` | `numeric` | 0.0% | 124 | `44.0, 34.2, 32.3` |

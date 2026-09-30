# Dataset Profile: NCRB_CII_2018_State_Table17A.1.csv (FILE_134)

## Metadata Summary
- **File Path**: `NCRB_CII_2018_State_Table17A.1.csv`
- **File Size**: 23,262 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1912-2096`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 143
- **Column Count**: 25
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (22)**: `Cases Pending Investigation from Previous Year (Col.4), Cases Reported during the year (Col.5), Cases Reopened for Investigation (Col.6), Total Cases for Investigation (Col.7=Col.4+ Col.5+ Col.6), Cases Not Investigated under 157_1_b CRPC (Col.8), Cases Transferred to other State or Agency (Col.9), Cases Withdrawn by the Govt during Investigation (Col.10), Final Report - Cases Ended as FR Non Cognizable (Col.11), Final Report - Cases Ended as Final Report False (Col.12), Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute (Col.13)...`
- **Categorical Columns (3)**: `S. No (Col.1), Category (Col.2), Crime Head (Col.3)`
- **Geographic Columns**: `Cases Transferred to other State or Agency (Col.9), Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute (Col.13), Final Report - Cases True but Insufficient Evidence or Untraced or No Clue (Col.14), Chargesheets Submitted - Cases Chargsheeted Out of Cases from Previous Year (Col.17), Chargesheets Submitted - Cases Chargesheeted Out of Cases during the Year (Col.18)`
- **Year Columns**: `Cases Pending Investigation from Previous Year (Col.4), Cases Reported during the year (Col.5), Chargesheets Submitted - Cases Chargsheeted Out of Cases from Previous Year (Col.17), Chargesheets Submitted - Cases Chargesheeted Out of Cases during the Year (Col.18), Cases Pending Investigation at End of the Year (Col.23=Col.7- Col.10- Col.20- Col.21)`
- **Total/Aggregate Columns**: `Total Cases for Investigation (Col.7=Col.4+ Col.5+ Col.6), Final Report - Total (Col.16=Col.11+ Col.12+ Col.13+ Col.14+ Col.15), Total Cases Disposed Off by Police (Col.20=Col.8+ Col.9+ Col.16+ Col.19)`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `S. No (Col.1)` | `categorical` | 0.0% | 137 | `1, 2, 3` |
| `Category (Col.2)` | `categorical` | 0.0% | 8 | `Offences Affecting the Human Body, Offences against the State, Offences against Public Tranquillity` |
| `Crime Head (Col.3)` | `categorical` | 0.0% | 142 | `Murder, Culpable Homicide not amounting to Murder, Causing Death by Negligence - Total` |
| `Cases Pending Investigation from Previous Year (Col.4)` | `numeric` | 0.0% | 140 | `20839, 1745, 48536` |
| `Cases Reported during the year (Col.5)` | `numeric` | 0.0% | 138 | `29017, 3635, 144031` |
| `Cases Reopened for Investigation (Col.6)` | `numeric` | 0.0% | 45 | `35, 2, 15` |
| `Total Cases for Investigation (Col.7=Col.4+ Col.5+ Col.6)` | `numeric` | 0.0% | 140 | `49891, 5382, 192582` |
| `Cases Not Investigated under 157_1_b CRPC (Col.8)` | `numeric` | 0.0% | 19 | `4, 0, 5` |
| `Cases Transferred to other State or Agency (Col.9)` | `numeric` | 0.0% | 52 | `104, 6, 58` |
| `Cases Withdrawn by the Govt during Investigation (Col.10)` | `numeric` | 0.0% | 22 | `1, 0, 2` |
| `Final Report - Cases Ended as FR Non Cognizable (Col.11)` | `numeric` | 0.0% | 67 | `30, 8, 172` |
| `Final Report - Cases Ended as Final Report False (Col.12)` | `numeric` | 0.0% | 112 | `796, 99, 1203` |
| `Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute (Col.13)` | `numeric` | 0.0% | 112 | `830, 109, 2854` |
| `Final Report - Cases True but Insufficient Evidence or Untraced or No Clue (Col.14)` | `numeric` | 0.0% | 129 | `2773, 380, 24202` |
| `Final Report - Cases Abated during Investigation (Col.15)` | `numeric` | 0.0% | 67 | `250, 30, 5324` |
| `Final Report - Total (Col.16=Col.11+ Col.12+ Col.13+ Col.14+ Col.15)` | `numeric` | 0.0% | 137 | `4679, 626, 33755` |
| `Chargesheets Submitted - Cases Chargsheeted Out of Cases from Previous Year (Col.17)` | `numeric` | 0.0% | 131 | `8679, 943, 25571` |
| `Chargesheets Submitted - Cases Chargesheeted Out of Cases during the Year (Col.18)` | `numeric` | 0.0% | 138 | `16751, 2002, 84380` |
| `Chargesheets Submitted - Cases Chargesheeted (Col.19=Col.17+ Col.18)` | `numeric` | 0.0% | 139 | `25430, 2945, 109951` |
| `Total Cases Disposed Off by Police (Col.20=Col.8+ Col.9+ Col.16+ Col.19)` | `numeric` | 0.7% | 139 | `30217.0, 3577.0, 143769.0` |
| `Cases Quashed at Investigation Stage (Col.21)` | `numeric` | 0.0% | 50 | `1, 2, 27` |
| `Cases Stayed at Investigation Stage (Col.22)` | `numeric` | 0.0% | 51 | `90, 2, 309` |
| `Cases Pending Investigation at End of the Year (Col.23=Col.7- Col.10- Col.20- Col.21)` | `numeric` | 0.0% | 140 | `19672, 1803, 48784` |
| `Chargesheeting Rate (Col.24=Col.19/ Col.20) *100` | `numeric` | 0.0% | 127 | `84.2, 82.3, 76.5` |
| `Pendency Percentage (Col.25=Col.23/ Col.7) *100` | `numeric` | 0.7% | 124 | `39.4, 33.5, 25.3` |

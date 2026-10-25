# Dataset Profile: Table_17A.1_2016.csv (FILE_111)

## Metadata Summary
- **File Path**: `Table_17A.1_2016.csv`
- **File Size**: 5,993 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1906-2070`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 38
- **Column Count**: 19
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (16)**: `Cases Pending Investigation from Previous Year (Col.4), Cases Reported during the year (Col.5), Total Cases for Investigation (Col.6) = (Col. 4+5), Cases Withdrawn by Govt. (Col.7), Cases Transferred to other PS or Magistrate (Col.8), Cases not Investigated U/S 157(1) (b) of Cr.PC (Col.9), Final Report - True but Insufficient Evidence (Col.10), Final Report - False (Col.11), Final Report - Mistake of Fact (Col.12), Final Report - Non-Cognizable (Col.13)...`
- **Categorical Columns (3)**: `S. No. (Col.1), Category (Col.2), Crime Head (Col.3)`
- **Geographic Columns**: `Final Report - True but Insufficient Evidence (Col.10)`
- **Year Columns**: `Cases Pending Investigation from Previous Year (Col.4), Cases Reported during the year (Col.5), Cases Pending Investigation at the End of the Year (Col.17) = (Col. 6 -Col.7- Col.16)`
- **Total/Aggregate Columns**: `Total Cases for Investigation (Col.6) = (Col. 4+5), Final Report - Total (Col.14) = (Col.10+ Col.11+ Col.12+ Col.13), Total Cases Disposed off by Police (Col.16) = (Col.8+9+14+15)`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `S. No. (Col.1)` | `categorical` | 0.0% | 38 | `1, 2, 3` |
| `Category (Col.2)` | `categorical` | 0.0% | 9 | `A. Offences Affecting the Human Body, B. Offences against the State, C. Offences against Public Tranquility` |
| `Crime Head (Col.3)` | `categorical` | 0.0% | 38 | `Murder, Culpable Homicide not Amounting to Murder, Causing Death by Negligence` |
| `Cases Pending Investigation from Previous Year (Col.4)` | `numeric` | 0.0% | 36 | `24576, 1970, 44571` |
| `Cases Reported during the year (Col.5)` | `numeric` | 0.0% | 37 | `30450, 3203, 140215` |
| `Total Cases for Investigation (Col.6) = (Col. 4+5)` | `numeric` | 0.0% | 37 | `55026, 5173, 184786` |
| `Cases Withdrawn by Govt. (Col.7)` | `numeric` | 0.0% | 18 | `4, 0, 8` |
| `Cases Transferred to other PS or Magistrate (Col.8)` | `numeric` | 0.0% | 32 | `126, 3, 62` |
| `Cases not Investigated U/S 157(1) (b) of Cr.PC (Col.9)` | `numeric` | 0.0% | 15 | `1, 0, 15` |
| `Final Report - True but Insufficient Evidence (Col.10)` | `numeric` | 0.0% | 37 | `3037, 319, 24001` |
| `Final Report - False (Col.11)` | `numeric` | 0.0% | 37 | `1029, 107, 2015` |
| `Final Report - Mistake of Fact (Col.12)` | `numeric` | 0.0% | 36 | `523, 49, 2324` |
| `Final Report - Non-Cognizable (Col.13)` | `numeric` | 0.0% | 33 | `85, 19, 1167` |
| `Final Report - Total (Col.14) = (Col.10+ Col.11+ Col.12+ Col.13)` | `numeric` | 0.0% | 37 | `4674, 494, 29507` |
| `Cases in Which Chargesheets were Submitted (Col.15)` | `numeric` | 0.0% | 37 | `27538, 2750, 105266` |
| `Total Cases Disposed off by Police (Col.16) = (Col.8+9+14+15)` | `numeric` | 0.0% | 37 | `32339, 3247, 134850` |
| `Cases Pending Investigation at the End of the Year (Col.17) = (Col. 6 -Col.7- Col.16)` | `numeric` | 0.0% | 37 | `22683, 1926, 49932` |
| `Chargesheeting Rate (Col.18) = (Col.15/ Col.16) * 100` | `numeric` | 0.0% | 36 | `85.2, 84.7, 78.1` |
| `Pendency Percentage (Col.19) = (Col.17/ (Col.6)) * 100` | `numeric` | 0.0% | 34 | `41.2, 37.2, 27.0` |

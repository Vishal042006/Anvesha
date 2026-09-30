# Dataset Profile: NCRB_CII-2019_Table_17A.1.csv (FILE_100)

## Metadata Summary
- **File Path**: `NCRB_CII-2019_Table_17A.1.csv`
- **File Size**: 18,087 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1900-2093`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 142
- **Column Count**: 24
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (22)**: `Cases Pending Investigation from Previous Year, Cases Reported during the year, Cases Reopened for Investigation, Total Cases for Investigation (Col.3+ Col.4+ Col.5), Cases Not Investigated Under 157_1_b CRPC, Cases Transferred to other State or Agency, Cases Withdrawn by the Govt during investigation, Final Report - Cases Ended as FR Non Cognizable, Final Report - Cases Ended as Final Report False, Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute...`
- **Categorical Columns (2)**: `S. No, Crime Head`
- **Geographic Columns**: `Cases Transferred to other State or Agency, Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute, Final Report - Cases True but Insufficient Evidence or Untraced or No Clue, Chargesheets submitted - Cases Chargesheeted Out of Cases from Previous Year, Chargesheets submitted - Cases Chargesheeted Out of Cases during the Year`
- **Year Columns**: `Cases Pending Investigation from Previous Year, Cases Reported during the year, Chargesheets submitted - Cases Chargesheeted Out of Cases from Previous Year, Chargesheets submitted - Cases Chargesheeted Out of Cases during the Year, Cases Pending Investigation at End of the Year (Col.6- Col.9- Col.19- Col.20)`
- **Total/Aggregate Columns**: `Total Cases for Investigation (Col.3+ Col.4+ Col.5), Final Report - Total (Col.10+ Col.11+ Col.12+ Col.13+ Col.14), Total Cases Disposed Off by Police (Col.7+ Col.8+ Col.15+ Col.18)`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `S. No` | `categorical` | 0.0% | 136 | `1, 2, 3` |
| `Crime Head` | `categorical` | 0.0% | 138 | `Murder, Culpable Homicide not amounting to Murder, Causing Death by Negligence` |
| `Cases Pending Investigation from Previous Year` | `numeric` | 0.0% | 141 | `19589, 1620, 47517` |
| `Cases Reported during the year` | `numeric` | 0.0% | 140 | `28918, 3470, 144842` |
| `Cases Reopened for Investigation` | `numeric` | 0.0% | 42 | `46, 14, 23` |
| `Total Cases for Investigation (Col.3+ Col.4+ Col.5)` | `numeric` | 0.0% | 141 | `48553, 5104, 192382` |
| `Cases Not Investigated Under 157_1_b CRPC` | `numeric` | 0.0% | 21 | `1, 0, 21` |
| `Cases Transferred to other State or Agency` | `numeric` | 0.0% | 46 | `94, 1, 36` |
| `Cases Withdrawn by the Govt during investigation` | `numeric` | 0.0% | 12 | `0, 1, 3` |
| `Final Report - Cases Ended as FR Non Cognizable` | `numeric` | 0.0% | 62 | `7, 4, 93` |
| `Final Report - Cases Ended as Final Report False` | `numeric` | 0.0% | 113 | `873, 120, 1439` |
| `Final Report - Cases Ended as Mistake of Fact or of Law or Civil Dispute` | `numeric` | 0.0% | 112 | `762, 89, 2849` |
| `Final Report - Cases True but Insufficient Evidence or Untraced or No Clue` | `numeric` | 0.0% | 127 | `2087, 386, 22790` |
| `Final Report - Cases Abated during Investigation` | `numeric` | 0.0% | 72 | `229, 24, 5316` |
| `Final Report - Total (Col.10+ Col.11+ Col.12+ Col.13+ Col.14)` | `numeric` | 0.0% | 132 | `3958, 623, 32487` |
| `Chargesheets submitted - Cases Chargesheeted Out of Cases from Previous Year` | `numeric` | 0.0% | 132 | `7380, 793, 23891` |
| `Chargesheets submitted - Cases Chargesheeted Out of Cases during the Year` | `numeric` | 0.0% | 139 | `16183, 1898, 83843` |
| `Chargesheets submitted - Cases Chargesheeted (Col.16+ Col.17)` | `numeric` | 0.0% | 139 | `23563, 2691, 107734` |
| `Total Cases Disposed Off by Police (Col.7+ Col.8+ Col.15+ Col.18)` | `numeric` | 0.0% | 140 | `27616, 3315, 140278` |
| `Cases Quashed at Investigation Stage` | `numeric` | 0.0% | 56 | `1, 3, 48` |
| `Cases Stayed at Investigation Stage` | `numeric` | 0.0% | 45 | `89, 3, 37` |
| `Cases Pending Investigation at End of the Year (Col.6- Col.9- Col.19- Col.20)` | `numeric` | 0.0% | 140 | `20936, 1786, 52056` |
| `Charge-Sheeting Rate (Col.18/ Col.19) *100` | `numeric` | 0.0% | 117 | `85.3, 81.2, 76.8` |
| `Pendency Percentage (Col.22/ Col.6) *100` | `numeric` | 0.0% | 123 | `43.1, 35.0, 27.1` |

# Dataset Profile: NCRB_CII_2023_Table_10A.5_0_0.csv (FILE_262)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/NCRB_CII_2023_Table_10A.5_0_0.csv`
- **File Size**: 1,815 bytes
- **Domain Category**: `COURT DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2023`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 8
- **Column Count**: 22
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (20)**: `Cases Pending Trial from the Previous Year ( Col. 3 ), Cases Sent for Trial during the year ( Col. 4 ), Total Cases for Trial (Col.3 +Col.4) ( Col. 5 ), Cases Abated by Court ( Col. 6 ), Cases Withdrawn from Prosecution ( Col. 7 ), Cases Compounded or Compromised ( Col. 8 ), Cases Disposed off by Plea Bargaining ( Col. 9 ), Cases Quashed ( Col. 10 ), Cases Disposed off without trial (Col.6+Col.7+Col.8+Col.9+Col.10) ( Col. 11 ), Cases Stayed or Sent to Record Room ( Col. 12 )...`
- **Categorical Columns (2)**: `Sl. No. ( Col. 1 ), Crime Head ( Col. 2 )`
- **Geographic Columns**: `Cases Withdrawn from Prosecution ( Col. 7 ), Cases Disposed off without trial (Col.6+Col.7+Col.8+Col.9+Col.10) ( Col. 11 ), Cases Convicted Out of Cases from Previous Year ( Col. 13 ), Cases Convicted Out of Cases during the Year ( Col. 14 )`
- **Year Columns**: `Cases Pending Trial from the Previous Year ( Col. 3 ), Cases Sent for Trial during the year ( Col. 4 ), Cases Convicted Out of Cases from Previous Year ( Col. 13 ), Cases Convicted Out of Cases during the Year ( Col. 14 ), Cases Pending Trial at End of the Year (Col.5-Col.19) ( Col. 20 )`
- **Total/Aggregate Columns**: `Total Cases for Trial (Col.3 +Col.4) ( Col. 5 )`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Sl. No. ( Col. 1 )` | `categorical` | 0.0% | 8 | `1, 1.1, 1.2` |
| `Crime Head ( Col. 2 )` | `categorical` | 0.0% | 7 | `Offences against State, Sedition, Others` |
| `Cases Pending Trial from the Previous Year ( Col. 3 )` | `numeric` | 0.0% | 8 | `633, 131, 502` |
| `Cases Sent for Trial during the year ( Col. 4 )` | `numeric` | 0.0% | 8 | `37, 10, 27` |
| `Total Cases for Trial (Col.3 +Col.4) ( Col. 5 )` | `numeric` | 0.0% | 8 | `670, 141, 529` |
| `Cases Abated by Court ( Col. 6 )` | `numeric` | 0.0% | 5 | `0, 20, 130` |
| `Cases Withdrawn from Prosecution ( Col. 7 )` | `numeric` | 0.0% | 5 | `0, 53, 24` |
| `Cases Compounded or Compromised ( Col. 8 )` | `numeric` | 0.0% | 5 | `1, 0, 129` |
| `Cases Disposed off by Plea Bargaining ( Col. 9 )` | `numeric` | 0.0% | 2 | `0, 37` |
| `Cases Quashed ( Col. 10 )` | `numeric` | 0.0% | 5 | `2, 0, 11` |
| `Cases Disposed off without trial (Col.6+Col.7+Col.8+Col.9+Col.10) ( Col. 11 )` | `numeric` | 0.0% | 7 | `3, 1, 2` |
| `Cases Stayed or Sent to Record Room ( Col. 12 )` | `numeric` | 0.0% | 4 | `0, 12, 4` |
| `Cases Convicted Out of Cases from Previous Year ( Col. 13 )` | `numeric` | 0.0% | 6 | `0, 1, 587` |
| `Cases Convicted Out of Cases during the Year ( Col. 14 )` | `numeric` | 0.0% | 5 | `1, 0, 431` |
| `Cases Convicted (Col.13 +Col.14) ( Col. 15 )` | `numeric` | 0.0% | 6 | `1, 0, 1018` |
| `Cases Discharged ( Col. 16 )` | `numeric` | 0.0% | 4 | `1, 0, 132` |
| `Cases Acquitted ( Col. 17 )` | `numeric` | 0.0% | 7 | `22, 12, 10` |
| `Cases in which Trials were Completed (Col.15+Col.16+Col.17) ( Col. 18 )` | `numeric` | 0.0% | 7 | `24, 12, 6` |
| `Cases Disposed off by Courts (Col.11+Col.18) ( Col. 19 )` | `numeric` | 0.0% | 7 | `27, 13, 14` |
| `Cases Pending Trial at End of the Year (Col.5-Col.19) ( Col. 20 )` | `numeric` | 0.0% | 8 | `643, 128, 515` |
| `Conviction Rate (Col.15/Col.18)*100 ( Col. 21 )` | `numeric` | 0.0% | 8 | `4.2, 0.0, 8.3` |
| `Pendency Percentage (Col.20/Col.5)*100 ( Col. 22 )` | `numeric` | 0.0% | 8 | `96.0, 90.8, 97.4` |

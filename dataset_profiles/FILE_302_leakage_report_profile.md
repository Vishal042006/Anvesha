# Dataset Profile: leakage_report.csv (FILE_302)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/leakage_report.csv`
- **File Size**: 1,185 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 5
- **Column Count**: 6
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (0)**: ``
- **Categorical Columns (6)**: `feature_name, target_task, leakage_type, risk_level, reason, recommendation`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `feature_name` | `categorical` | 0.0% | 5 | `persons_convicted, persons_acquitted, cases_disposed` |
| `target_task` | `categorical` | 0.0% | 2 | `TASK A: Next-year crime count forecasting, TASK C: Crime-category classification` |
| `leakage_type` | `categorical` | 0.0% | 3 | `POST_OUTCOME_LEAKAGE, TOTAL_SUM_LEAKAGE, FUTURE_VARIABLE_LEAKAGE` |
| `risk_level` | `categorical` | 0.0% | 2 | `HIGH, CRITICAL` |
| `reason` | `categorical` | 0.0% | 5 | `Conviction statistics are post-trial court disposal outcomes., Acquittal statistics are court disposal outcomes occurring long after incident., Police/Court disposal rates reflect future processing status.` |
| `recommendation` | `categorical` | 0.0% | 5 | `Exclude conviction features when predicting future crime occurrence., Exclude acquittal features when predicting incident count., Exclude disposal status features from crime incident forecasting.` |

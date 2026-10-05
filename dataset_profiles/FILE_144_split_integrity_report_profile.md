# Dataset Profile: SPLIT_INTEGRITY_REPORT.csv (FILE_144)

## Metadata Summary
- **File Path**: `SPLIT_INTEGRITY_REPORT.csv`
- **File Size**: 653 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 7
- **Column Count**: 10
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (7)**: `train_rows, validation_rows, test_rows, train_val_overlap, train_test_overlap, val_test_overlap, preprocessor_fitted_on_train_only`
- **Categorical Columns (3)**: `task_group, filename, split_integrity_status`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `validation_rows, train_val_overlap, train_test_overlap, val_test_overlap, split_integrity_status, preprocessor_fitted_on_train_only`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `task_group` | `categorical` | 0.0% | 6 | `forecasting, anomaly_detection, classification` |
| `filename` | `categorical` | 0.0% | 7 | `crime_forecasting_training.csv, crime_rate_forecasting_training.csv, crime_anomaly_training.csv` |
| `train_rows` | `numeric` | 0.0% | 2 | `496, 584` |
| `validation_rows` | `numeric` | 0.0% | 1 | `3` |
| `test_rows` | `numeric` | 0.0% | 2 | `2, 5` |
| `train_val_overlap` | `numeric` | 0.0% | 1 | `0` |
| `train_test_overlap` | `numeric` | 0.0% | 1 | `0` |
| `val_test_overlap` | `numeric` | 0.0% | 1 | `0` |
| `split_integrity_status` | `categorical` | 0.0% | 1 | `PASS` |
| `preprocessor_fitted_on_train_only` | `numeric` | 0.0% | 1 | `True` |

# Dataset Profile: FEATURE_REGISTRY.csv (FILE_251)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/FEATURE_REGISTRY.csv`
- **File Size**: 710 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 5
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (2)**: `uses_future_data, available_at_prediction_time`
- **Categorical Columns (6)**: `feature_name, source_columns, transformation, window, leakage_status, description`
- **Geographic Columns**: `uses_future_data`
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `source_columns, uses_future_data, leakage_status, available_at_prediction_time`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `feature_name` | `categorical` | 0.0% | 5 | `previous_year_crime, two_year_avg, three_year_avg` |
| `source_columns` | `categorical` | 0.0% | 1 | `crime_count` |
| `transformation` | `categorical` | 0.0% | 5 | `shift(1), shift(1).rolling(2).mean(), shift(1).rolling(3).mean()` |
| `window` | `categorical` | 0.0% | 4 | `1 year, 2 years, 3 years` |
| `uses_future_data` | `numeric` | 0.0% | 1 | `False` |
| `leakage_status` | `categorical` | 0.0% | 1 | `SAFE` |
| `available_at_prediction_time` | `numeric` | 0.0% | 1 | `True` |
| `description` | `categorical` | 0.0% | 5 | `Crime count in previous calendar year, 2-year rolling average crime count, 3-year rolling average crime count` |

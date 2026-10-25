# Dataset Profile: TARGET_DEFINITION_REGISTRY.csv (FILE_271)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/TARGET_DEFINITION_REGISTRY.csv`
- **File Size**: 811 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 5
- **Column Count**: 5
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (0)**: ``
- **Categorical Columns (5)**: `target_name, task, target_type, definition, leakage_firewall_rule`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `target_name` | `categorical` | 0.0% | 5 | `crime_count_next_year, crime_rate_next_year, trend_direction` |
| `task` | `categorical` | 0.0% | 5 | `Task A: Count Forecasting, Task B: Rate Forecasting, Task E: Trend Classification` |
| `target_type` | `categorical` | 0.0% | 5 | `Continuous / Integer, Continuous / Float, Categorical (UP, DOWN, STABLE)` |
| `definition` | `categorical` | 0.0% | 5 | `Total crime count in year t+1, Crime rate per 100k population in year t+1, UP if YoY > +5%, DOWN if YoY < -5%, STABLE otherwise` |
| `leakage_firewall_rule` | `categorical` | 0.0% | 4 | `feature_year < target_year, Evaluated strictly on YoY % change, Unsupervised feature computation` |

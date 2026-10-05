# Dataset Profile: TRAINING_DATA_SUMMARY.csv (FILE_273)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/TRAINING_DATA_SUMMARY.csv`
- **File Size**: 1,629 bytes
- **Domain Category**: `HUMAN TRAFFICKING / MISSING PERSONS`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 6
- **Column Count**: 17
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (5)**: `rows, features, train_rows, validation_rows, test_rows`
- **Categorical Columns (12)**: `dataset_name, task, domain, grain, target, target_type, missing_percentage, leakage_check, provenance_check, geographic_coverage...`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `grain, rows, train_rows, validation_rows, test_rows, missing_percentage, temporal_coverage, training_ready`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset_name` | `categorical` | 0.0% | 6 | `crime_forecasting_training.csv, crime_rate_forecasting_training.csv, crime_anomaly_training.csv` |
| `task` | `categorical` | 0.0% | 6 | `Count Forecasting (Task A), Rate Forecasting (Task B), Anomaly Detection (Task D)` |
| `domain` | `categorical` | 0.0% | 2 | `crime_general, courts` |
| `grain` | `categorical` | 0.0% | 1 | `district x year x crime_category` |
| `rows` | `numeric` | 0.0% | 1 | `592` |
| `features` | `numeric` | 0.0% | 3 | `12, 10, 15` |
| `target` | `categorical` | 0.0% | 5 | `crime_count_next_year, crime_rate_next_year, anomaly_score / is_anomaly_flag` |
| `target_type` | `categorical` | 0.0% | 5 | `Continuous (Integer), Continuous (Float), Z-Score / Boolean Flag` |
| `train_rows` | `numeric` | 0.0% | 1 | `450` |
| `validation_rows` | `numeric` | 0.0% | 1 | `70` |
| `test_rows` | `numeric` | 0.0% | 1 | `72` |
| `missing_percentage` | `categorical` | 0.0% | 1 | `0.0%` |
| `leakage_check` | `categorical` | 0.0% | 4 | `PASS (Quarantined post-outcome features), PASS, PASS (Centroids & Adjacency lists mapped)` |
| `provenance_check` | `categorical` | 0.0% | 2 | `PASS (Traceable to SCRB/NCRB), PASS` |
| `geographic_coverage` | `categorical` | 0.0% | 2 | `Tamil Nadu (44 Districts/Commissionerates), Tamil Nadu` |
| `temporal_coverage` | `categorical` | 0.0% | 1 | `2001 - 2023` |
| `training_ready` | `categorical` | 0.0% | 1 | `YES` |

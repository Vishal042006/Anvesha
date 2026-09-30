# Dataset Profile: OUTLIER_REPORT.csv (FILE_269)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/OUTLIER_REPORT.csv`
- **File Size**: 269,201 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,418
- **Column Count**: 10
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (5)**: `zero_count, zero_percentage, outlier_count, iqr_upper_threshold, is_zero_inflated`
- **Categorical Columns (5)**: `dataset, file_id, column, outlier_method, recommendation`
- **Geographic Columns**: `outlier_count, outlier_method`
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `outlier_method, recommendation`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset` | `categorical` | 0.0% | 129 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `file_id` | `categorical` | 0.0% | 129 | `FILE_001, FILE_002, FILE_003` |
| `column` | `categorical` | 0.0% | 851 | `MURDER, ATTEMPT TO MURDER, RAPE` |
| `zero_count` | `numeric` | 0.0% | 544 | `185, 486, 498` |
| `zero_percentage` | `numeric` | 0.0% | 780 | `2.05, 5.39, 5.52` |
| `outlier_count` | `numeric` | 0.0% | 304 | `318, 385, 336` |
| `iqr_upper_threshold` | `numeric` | 0.0% | 576 | `210.0, 194.0, 140.0` |
| `outlier_method` | `categorical` | 0.0% | 1 | `IQR_3.0x` |
| `is_zero_inflated` | `numeric` | 0.0% | 2 | `False, True` |
| `recommendation` | `categorical` | 0.0% | 1 | `Flag outliers with is_statistical_outlier flag; retain original count.` |

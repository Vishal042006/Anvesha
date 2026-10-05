# Dataset Profile: quality_report.csv (FILE_306)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/quality_report.csv`
- **File Size**: 49,141 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 411
- **Column Count**: 7
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (1)**: `issue_count`
- **Categorical Columns (6)**: `dataset_id, filename, check_name, status, details, recommendation`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset_id` | `categorical` | 0.0% | 137 | `FILE_001, FILE_002, FILE_003` |
| `filename` | `categorical` | 0.0% | 137 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `check_name` | `categorical` | 0.0% | 3 | `NEGATIVE_COUNTS_CHECK, MISSING_VALUES_CHECK, DUPLICATE_ROWS_CHECK` |
| `status` | `categorical` | 0.0% | 3 | `PASS, WARNING, FAIL` |
| `issue_count` | `numeric` | 0.0% | 29 | `0, 2, 121` |
| `details` | `categorical` | 0.0% | 41 | `All numeric counts non-negative, Missing cell count: 0 (0.0%), Duplicate row count: 0` |
| `recommendation` | `categorical` | 65.69% | 4 | `Standard handling, Deduplicate exact matching rows prior to feature integration, Impute missing features carefully or exclude columns with >50% missing` |

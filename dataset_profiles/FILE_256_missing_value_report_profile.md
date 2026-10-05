# Dataset Profile: MISSING_VALUE_REPORT.csv (FILE_256)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/MISSING_VALUE_REPORT.csv`
- **File Size**: 53,308 bytes
- **Domain Category**: `HUMAN TRAFFICKING / MISSING PERSONS`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 231
- **Column Count**: 7
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (2)**: `missing_count, missing_percentage`
- **Categorical Columns (5)**: `dataset, file_id, column, missing_reason, recommended_action`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `missing_reason, recommended_action`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset` | `categorical` | 0.0% | 51 | `03_District_wise_crimes_committed_against_children_2001_2012.csv, 04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2012.csv, 24_Anti_corruption_arrests.csv` |
| `file_id` | `categorical` | 0.0% | 51 | `FILE_010, FILE_015, FILE_061` |
| `column` | `categorical` | 0.0% | 162 | `Murder, Rape, Kidnapping and Abduction` |
| `missing_count` | `numeric` | 0.0% | 77 | `11, 1, 14` |
| `missing_percentage` | `numeric` | 0.0% | 116 | `0.12, 0.1, 0.29` |
| `missing_reason` | `categorical` | 0.0% | 1 | `Unrecorded observation or non-applicable administrative field` |
| `recommended_action` | `categorical` | 0.0% | 1 | `Exclude from dense feature matrices if missingness > 40%; preserve as null otherwise.` |

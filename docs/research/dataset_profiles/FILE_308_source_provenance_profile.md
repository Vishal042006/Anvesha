# Dataset Profile: source_provenance.csv (FILE_308)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/source_provenance.csv`
- **File Size**: 21,206 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `1901-2098`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 106
- **Column Count**: 9
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (1)**: `rows_extracted`
- **Categorical Columns (8)**: `file_id, filename, relative_path, source_organization, detected_state, detected_year, transformation_version, processing_timestamp`
- **Geographic Columns**: `detected_state`
- **Year Columns**: `detected_year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `transformation_version, processing_timestamp`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `file_id` | `categorical` | 0.0% | 106 | `FILE_001, FILE_002, FILE_003` |
| `filename` | `categorical` | 0.0% | 106 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `relative_path` | `categorical` | 0.0% | 106 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `source_organization` | `categorical` | 0.0% | 2 | `NCRB / MHA India, Tamil Nadu SCRB` |
| `rows_extracted` | `numeric` | 0.0% | 45 | `9017, 823, 838` |
| `detected_state` | `categorical` | 0.0% | 4 | `India / Multi-State, India (Includes Tamil Nadu), UNKNOWN` |
| `detected_year` | `categorical` | 0.0% | 39 | `2001-2012, 2013, 2014` |
| `transformation_version` | `categorical` | 0.0% | 1 | `v1.0.0-anvesha-canonical` |
| `processing_timestamp` | `categorical` | 0.0% | 1 | `2026-09-29T23:26:08.781917` |

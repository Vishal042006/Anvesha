# Dataset Profile: schema_dictionary.csv (FILE_307)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/schema_dictionary.csv`
- **File Size**: 431,997 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 2,532
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (1)**: `confidence`
- **Categorical Columns (7)**: `source_file, file_id, source_column, canonical_column, transformation, data_type, description`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `source_file` | `categorical` | 0.0% | 134 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `file_id` | `categorical` | 0.0% | 134 | `FILE_001, FILE_002, FILE_003` |
| `source_column` | `categorical` | 0.0% | 1322 | `STATE/UT, DISTRICT, YEAR` |
| `canonical_column` | `categorical` | 0.0% | 18 | `state, district, year` |
| `transformation` | `categorical` | 0.0% | 6 | `uppercase_strip, extract_4digit_year, numeric_parse` |
| `data_type` | `categorical` | 0.0% | 4 | `string, integer, string/numeric` |
| `description` | `categorical` | 0.0% | 922 | `State or Union Territory name, District or Police administrative unit, Calendar year of recording` |
| `confidence` | `numeric` | 0.0% | 5 | `1.0, 0.85, 0.7` |

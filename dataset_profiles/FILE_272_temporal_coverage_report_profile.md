# Dataset Profile: TEMPORAL_COVERAGE_REPORT.csv (FILE_272)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/TEMPORAL_COVERAGE_REPORT.csv`
- **File Size**: 21,611 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `1900-2099`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 137
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `minimum_year, maximum_year, total_years_covered, continuous_history`
- **Categorical Columns (4)**: `dataset_id, filename, domain, available_years`
- **Geographic Columns**: ``
- **Year Columns**: `minimum_year, maximum_year, total_years_covered, available_years`
- **Total/Aggregate Columns**: `total_years_covered`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset_id` | `categorical` | 0.0% | 137 | `FILE_001, FILE_002, FILE_003` |
| `filename` | `categorical` | 0.0% | 137 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `domain` | `categorical` | 0.0% | 12 | `crime_general, crime_sc, crime_st` |
| `minimum_year` | `numeric` | 11.68% | 27 | `2001.0, 2013.0, 2014.0` |
| `maximum_year` | `numeric` | 11.68% | 26 | `2012.0, 2013.0, 2014.0` |
| `total_years_covered` | `numeric` | 0.0% | 31 | `12, 1, 18` |
| `available_years` | `categorical` | 11.68% | 44 | `2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012, 2013, 2014` |
| `continuous_history` | `numeric` | 0.0% | 2 | `True, False` |

# Dataset Profile: DATASET_GRAIN_REGISTRY.csv (FILE_250)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/DATASET_GRAIN_REGISTRY.csv`
- **File Size**: 27,129 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `1900-2099`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 137
- **Column Count**: 15
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `year_start, year_end, row_count, usable_for_ml`
- **Categorical Columns (11)**: `dataset_id, source_file, source_dataset, domain, source_grain, geographic_grain, temporal_grain, crime_grain, demographic_grain, geography_coverage...`
- **Geographic Columns**: ``
- **Year Columns**: `year_start, year_end`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `reason_if_not_usable`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `dataset_id` | `categorical` | 0.0% | 137 | `FILE_001, FILE_002, FILE_003` |
| `source_file` | `categorical` | 0.0% | 137 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `source_dataset` | `categorical` | 0.0% | 137 | `FILE_001, FILE_002, FILE_003` |
| `domain` | `categorical` | 0.0% | 12 | `crime_general, crime_sc, crime_st` |
| `source_grain` | `categorical` | 0.0% | 8 | `district_year_crime, state_year_crime_disposal, state_year_crime` |
| `geographic_grain` | `categorical` | 0.0% | 3 | `district, state, UNKNOWN` |
| `temporal_grain` | `categorical` | 0.0% | 2 | `Annual, Single-year / Aggregate` |
| `crime_grain` | `categorical` | 0.0% | 13 | `CRIME AGAINST WOMEN, CRIME AGAINST CHILDREN, ARRESTS / POLICE DISPOSAL` |
| `demographic_grain` | `categorical` | 0.0% | 2 | `General Population, Gender/Age` |
| `year_start` | `numeric` | 11.68% | 27 | `2001.0, 2013.0, 2014.0` |
| `year_end` | `numeric` | 11.68% | 26 | `2012.0, 2013.0, 2014.0` |
| `geography_coverage` | `categorical` | 0.0% | 4 | `India / Multi-State, India (Includes Tamil Nadu), UNKNOWN` |
| `row_count` | `numeric` | 0.0% | 68 | `9017, 823, 838` |
| `usable_for_ml` | `numeric` | 0.0% | 2 | `True, False` |
| `reason_if_not_usable` | `categorical` | 70.07% | 1 | `Unstructured document or missing spatial key` |

# Dataset Profile: india_baseline_crime_dataset.csv (FILE_300)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/india_baseline_crime_dataset.csv`
- **File Size**: 529,023,612 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `district_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001`
- **Quality Score**: `90/100`

## Dimensions
- **Row Count**: 2,331,801
- **Column Count**: 14
- **Duplicate Rows**: 736698

## Column Classification
- **Numeric Columns (3)**: `crime_count, population, crime_rate`
- **Categorical Columns (11)**: `state, district, year, crime_category, crime_head_raw, source_file, source_dataset, source_year, source_organization, transformation_version...`
- **Geographic Columns**: `state, district`
- **Year Columns**: `year, source_year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `transformation_version, processing_timestamp`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `state` | `categorical` | 0.0% | 956 | `ANDHRA PRADESH, ARUNACHAL PRADESH, ASSAM` |
| `district` | `categorical` | 0.0% | 1871 | `ADILABAD, ANANTAPUR, CHITTOOR` |
| `year` | `categorical` | 0.0% | 2194 | `2001, 2002, 2003` |
| `crime_category` | `categorical` | 0.0% | 12 | `CRIME AGAINST WOMEN, CRIME AGAINST CHILDREN, ARRESTS / POLICE DISPOSAL` |
| `crime_head_raw` | `categorical` | 0.0% | 1052 | `murder, attempt_to_murder, culpable_homicide_not_amounting_to_murder` |
| `crime_count` | `numeric` | 0.0% | 58554 | `101, 60, 17` |
| `source_file` | `categorical` | 0.0% | 105 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `source_dataset` | `categorical` | 0.0% | 105 | `FILE_001, FILE_002, FILE_003` |
| `source_year` | `categorical` | 0.0% | 2194 | `2001, 2002, 2003` |
| `source_organization` | `categorical` | 0.0% | 2 | `NCRB / MHA India, Tamil Nadu SCRB` |
| `transformation_version` | `categorical` | 0.0% | 1 | `v1.0.0-anvesha-training` |
| `processing_timestamp` | `categorical` | 0.0% | 1 | `2026-09-29T23:36:04.789295` |
| `population` | `numeric` | 0.0% | 7 | `70000000, 35350000, 35003500` |
| `crime_rate` | `numeric` | 0.0% | 29329 | `0.14, 0.09, 0.02` |

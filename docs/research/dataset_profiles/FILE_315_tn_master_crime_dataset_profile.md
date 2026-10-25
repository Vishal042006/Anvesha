# Dataset Profile: tn_master_crime_dataset.csv (FILE_315)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/tn_master_crime_dataset.csv`
- **File Size**: 19,642,384 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `district_year_crime`
- **Source Organization**: `Tamil Nadu SCRB`
- **Geography Level**: `district`
- **Detected Geography**: `Tamil Nadu`
- **Detected Year**: `2001`
- **Quality Score**: `90/100`

## Dimensions
- **Row Count**: 87,889
- **Column Count**: 14
- **Duplicate Rows**: 13647

## Column Classification
- **Numeric Columns (5)**: `year, crime_count, source_year, population, crime_rate`
- **Categorical Columns (9)**: `state, district, crime_category, crime_head_raw, source_file, source_dataset, source_organization, transformation_version, processing_timestamp`
- **Geographic Columns**: `state, district`
- **Year Columns**: `year, source_year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `state, transformation_version, processing_timestamp`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `state` | `categorical` | 0.0% | 1 | `Tamil Nadu` |
| `district` | `categorical` | 0.0% | 86 | `ARIYALUR, CHENGAI, CHENNAI` |
| `year` | `numeric` | 0.0% | 150 | `2001.0, 2002.0, 2003.0` |
| `crime_category` | `categorical` | 0.0% | 7 | `CRIME AGAINST WOMEN, CRIME AGAINST CHILDREN, ARRESTS / POLICE DISPOSAL` |
| `crime_head_raw` | `categorical` | 0.0% | 600 | `murder, attempt_to_murder, culpable_homicide_not_amounting_to_murder` |
| `crime_count` | `numeric` | 0.0% | 3826 | `24, 41, 1` |
| `source_file` | `categorical` | 0.0% | 55 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `source_dataset` | `categorical` | 0.0% | 55 | `FILE_001, FILE_002, FILE_003` |
| `source_year` | `numeric` | 0.0% | 150 | `2001.0, 2002.0, 2003.0` |
| `source_organization` | `categorical` | 0.0% | 2 | `NCRB / MHA India, Tamil Nadu SCRB` |
| `transformation_version` | `categorical` | 0.0% | 1 | `v1.0.0-anvesha-training` |
| `processing_timestamp` | `categorical` | 0.0% | 1 | `2026-09-29T23:36:04.789295` |
| `population` | `numeric` | 0.0% | 5 | `3000000, 1515000, 1500150` |
| `crime_rate` | `numeric` | 0.0% | 4271 | `0.8, 1.37, 0.03` |

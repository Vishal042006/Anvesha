# Dataset Profile: 06_tn_crime_anomaly_detection.csv (FILE_176)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/06_tn_crime_anomaly_detection.csv`
- **File Size**: 57,910 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `district_year_crime`
- **Source Organization**: `Tamil Nadu SCRB`
- **Geography Level**: `district`
- **Detected Geography**: `Tamil Nadu`
- **Detected Year**: `1922-2095`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 592
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `year, crime_count, year_over_year_change, anomaly_score`
- **Categorical Columns (4)**: `state, district, crime_category, temporal_split`
- **Geographic Columns**: `state, district`
- **Year Columns**: `year, year_over_year_change`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `state`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `state` | `categorical` | 0.0% | 1 | `Tamil Nadu` |
| `district` | `categorical` | 0.0% | 86 | `ARIYALUR, Ariyalur, CHENGAI` |
| `year` | `numeric` | 0.0% | 23 | `2001, 2009, 2010` |
| `crime_category` | `categorical` | 0.0% | 6 | `CRIME AGAINST WOMEN, ARRESTS / POLICE DISPOSAL, CRIME AGAINST CHILDREN` |
| `crime_count` | `numeric` | 0.0% | 585 | `7418, 8586, 8325` |
| `year_over_year_change` | `numeric` | 0.0% | 502 | `0.0, 15.745483936714097, -3.039832281574852` |
| `anomaly_score` | `numeric` | 0.0% | 502 | `-0.0583422556068281, -0.0372884866824299, -0.0624069084737987` |
| `temporal_split` | `categorical` | 0.0% | 3 | `TRAIN, VALIDATION, TEST` |

# Dataset Profile: 05_tn_crime_forecasting.csv (FILE_175)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/05_tn_crime_forecasting.csv`
- **File Size**: 112,082 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `district_year_crime`
- **Source Organization**: `Tamil Nadu SCRB`
- **Geography Level**: `district`
- **Detected Geography**: `Tamil Nadu`
- **Detected Year**: `1922-2095`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 501
- **Column Count**: 20
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (15)**: `year, crime_count, previous_year_crime, two_year_avg, three_year_avg, five_year_avg, year_over_year_change, population, crime_rate, crime_share...`
- **Categorical Columns (5)**: `state, district, crime_category, trend_direction, temporal_split`
- **Geographic Columns**: `state, district, is_spatial_holdout`
- **Year Columns**: `year, previous_year_crime, two_year_avg, three_year_avg, five_year_avg, year_over_year_change, crime_count_next_year, crime_rate_next_year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `state, data_quality_score`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `state` | `categorical` | 0.0% | 1 | `Tamil Nadu` |
| `district` | `categorical` | 0.0% | 42 | `ARIYALUR, CHENGAI, CHENNAI` |
| `year` | `numeric` | 0.0% | 21 | `2001, 2009, 2010` |
| `crime_category` | `categorical` | 0.0% | 5 | `CRIME AGAINST WOMEN, ARRESTS / POLICE DISPOSAL, GENERAL CRIME / IPC` |
| `crime_count` | `numeric` | 0.0% | 498 | `7418, 8586, 8325` |
| `previous_year_crime` | `numeric` | 0.0% | 453 | `0.0, 7418.0, 8586.0` |
| `two_year_avg` | `numeric` | 0.0% | 454 | `0.0, 7418.0, 8002.0` |
| `three_year_avg` | `numeric` | 0.0% | 453 | `0.0, 7418.0, 8002.0` |
| `five_year_avg` | `numeric` | 0.0% | 456 | `0.0, 7418.0, 8002.0` |
| `year_over_year_change` | `numeric` | 0.0% | 456 | `0.0, 15.745483936714097, -3.039832281574852` |
| `population` | `numeric` | 0.0% | 9 | `3000000.0, 1500000.0, 1515000.0` |
| `crime_rate` | `numeric` | 0.0% | 501 | `247.26666666666668, 572.4, 555.0` |
| `crime_share` | `numeric` | 0.0% | 498 | `99.99999986519278, 99.99999988353132, 99.99999987987988` |
| `crime_count_next_year` | `numeric` | 0.0% | 496 | `8586.0, 8325.0, 8188.0` |
| `crime_rate_next_year` | `numeric` | 0.0% | 501 | `572.4, 555.0, 545.8666666666667` |
| `anomaly_score` | `numeric` | 0.0% | 456 | `-0.0583422556068281, -0.0372884866824299, -0.0624069084737987` |
| `trend_direction` | `categorical` | 0.0% | 3 | `STABLE, UP, DOWN` |
| `temporal_split` | `categorical` | 0.0% | 3 | `TRAIN, VALIDATION, TEST` |
| `is_spatial_holdout` | `numeric` | 0.0% | 2 | `False, True` |
| `data_quality_score` | `numeric` | 0.0% | 1 | `95.0` |

# Dataset Profile: 04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2013.csv (FILE_169)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2013.csv`
- **File Size**: 24,824 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `2013`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 418
- **Column Count**: 14
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (12)**: `Persons in custody or on bail during the stage of investigation at the beginning of the year, Persons arrested during the year, Persons released or freed by Police or Magistrate before trial for want of evidence or any other reason, Persons in custody or on bail during the stage of investigation at the end of the year, Persons in whose cases charge sheets were laid during the year, Persons under trial at the beginning of the year, Total number of persons under trial during the year, Persons against whom cases were compounded or withdrawn, Persons in custody or on bail during the stage of trial at the end of the year, Persons in whose cases trials were completed during the year...`
- **Categorical Columns (2)**: `STATE/UT, CRIME HEAD`
- **Geographic Columns**: `STATE/UT`
- **Year Columns**: `Persons in custody or on bail during the stage of investigation at the beginning of the year, Persons arrested during the year, Persons in custody or on bail during the stage of investigation at the end of the year, Persons in whose cases charge sheets were laid during the year, Persons under trial at the beginning of the year, Total number of persons under trial during the year, Persons in custody or on bail during the stage of trial at the end of the year, Persons in whose cases trials were completed during the year`
- **Total/Aggregate Columns**: `Total number of persons under trial during the year`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `STATE/UT` | `categorical` | 0.0% | 38 | `Andhra Pradesh, Arunachal Pradesh, Assam` |
| `CRIME HEAD` | `categorical` | 0.0% | 11 | `Arson, Dacoity, Hurt` |
| `Persons in custody or on bail during the stage of investigation at the beginning of the year` | `numeric` | 0.0% | 89 | `4, 0, 2` |
| `Persons arrested during the year` | `numeric` | 0.0% | 135 | `8, 0, 73` |
| `Persons released or freed by Police or Magistrate before trial for want of evidence or any other reason` | `numeric` | 0.0% | 44 | `0, 2, 1` |
| `Persons in custody or on bail during the stage of investigation at the end of the year` | `numeric` | 0.0% | 94 | `7, 0, 22` |
| `Persons in whose cases charge sheets were laid during the year` | `numeric` | 0.0% | 135 | `5, 0, 83` |
| `Persons under trial at the beginning of the year` | `numeric` | 0.0% | 176 | `35, 0, 6` |
| `Total number of persons under trial during the year` | `numeric` | 0.0% | 186 | `40, 0, 6` |
| `Persons against whom cases were compounded or withdrawn` | `numeric` | 0.0% | 33 | `0, 3, 12` |
| `Persons in custody or on bail during the stage of trial at the end of the year` | `numeric` | 0.0% | 175 | `38, 0, 277` |
| `Persons in whose cases trials were completed during the year` | `numeric` | 0.0% | 133 | `2, 0, 6` |
| `Persons convicted` | `numeric` | 0.0% | 76 | `0, 17, 6` |
| `Persons acquitted` | `numeric` | 0.0% | 127 | `2, 0, 6` |

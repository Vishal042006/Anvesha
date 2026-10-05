# Dataset Profile: 04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2013.csv (FILE_172)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2013.csv`
- **File Size**: 86,380 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `1907-2049`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,140
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
| `CRIME HEAD` | `categorical` | 0.0% | 30 | `Arson, Assault on Women wih intent to outrage her Modesty, Attempt to Commit Murder` |
| `Persons in custody or on bail during the stage of investigation at the beginning of the year` | `numeric` | 0.0% | 574 | `411, 9, 1214` |
| `Persons arrested during the year` | `numeric` | 0.0% | 725 | `820, 17, 771` |
| `Persons released or freed by Police or Magistrate before trial for want of evidence or any other reason` | `numeric` | 0.0% | 286 | `13, 3, 405` |
| `Persons in custody or on bail during the stage of investigation at the end of the year` | `numeric` | 0.0% | 573 | `404, 12, 1205` |
| `Persons in whose cases charge sheets were laid during the year` | `numeric` | 0.0% | 710 | `814, 11, 375` |
| `Persons under trial at the beginning of the year` | `numeric` | 0.0% | 846 | `1878, 124, 1674` |
| `Total number of persons under trial during the year` | `numeric` | 0.0% | 877 | `2692, 135, 2049` |
| `Persons against whom cases were compounded or withdrawn` | `numeric` | 0.0% | 262 | `87, 0, 188` |
| `Persons in custody or on bail during the stage of trial at the end of the year` | `numeric` | 0.0% | 860 | `1815, 135, 1795` |
| `Persons in whose cases trials were completed during the year` | `numeric` | 0.0% | 684 | `790, 0, 254` |
| `Persons convicted` | `numeric` | 0.0% | 504 | `63, 0, 29` |
| `Persons acquitted` | `numeric` | 0.0% | 632 | `727, 0, 225` |

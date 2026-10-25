# Dataset Profile: 04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2012.csv (FILE_168)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/04_01_Person_arrested_and_their_disposal_by_police_and_court_SLL_crime_2012.csv`
- **File Size**: 93,003 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `1904-2043`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,026
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
| `STATE/UT` | `categorical` | 0.0% | 38 | `ANDHRA PRADESH, ARUNACHAL PRADESH, ASSAM` |
| `CRIME HEAD` | `categorical` | 0.1% | 27 | `ARMS ACT, 1959, NARCOTIC DRUGS and PSYCHOTROPIC SUBSTANCES ACT, 1985, GAMBLING ACT` |
| `Persons in custody or on bail during the stage of investigation at the beginning of the year` | `numeric` | 0.0% | 281 | `301, 3, 1705` |
| `Persons arrested during the year` | `numeric` | 0.0% | 372 | `549, 14, 575` |
| `Persons released or freed by Police or Magistrate before trial for want of evidence or any other reason` | `numeric` | 0.0% | 104 | `0, 114, 14` |
| `Persons in custody or on bail during the stage of investigation at the end of the year` | `numeric` | 0.0% | 290 | `295, 5, 1934` |
| `Persons in whose cases charge sheets were laid during the year` | `numeric` | 0.0% | 371 | `555, 12, 232` |
| `Persons under trial at the beginning of the year` | `numeric` | 0.0% | 470 | `1153, 194, 2483` |
| `Total number of persons under trial during the year` | `numeric` | 0.0% | 504 | `1708, 206, 2715` |
| `Persons against whom cases were compounded or withdrawn` | `numeric` | 0.0% | 94 | `0, 237, 1` |
| `Persons in custody or on bail during the stage of trial at the end of the year` | `numeric` | 0.0% | 473 | `1324, 199, 2498` |
| `Persons in whose cases trials were completed during the year` | `numeric` | 0.0% | 357 | `384, 7, 217` |
| `Persons convicted` | `numeric` | 0.0% | 277 | `46, 4, 31` |
| `Persons acquitted` | `numeric` | 0.0% | 315 | `338, 3, 186` |

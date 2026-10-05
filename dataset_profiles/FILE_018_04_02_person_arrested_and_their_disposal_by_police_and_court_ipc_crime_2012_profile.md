# Dataset Profile: 04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2012.csv (FILE_018)

## Metadata Summary
- **File Path**: `04_02_Person_arrested_and_their_disposal_by_police_and_court_IPC_crime_2012.csv`
- **File Size**: 116,988 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `2012-2085`
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
| `STATE/UT` | `categorical` | 0.0% | 38 | `ANDHRA PRADESH, ARUNACHAL PRADESH, ASSAM` |
| `CRIME HEAD` | `categorical` | 0.0% | 30 | `MURDER (SECTION 302 IPC), ATTEMPT TO COMMIT MURDER (SECTION 307 IPC), CULPABALE HOMICIDE NOT AMOUNTING TO MURDER (SECTION 304, 308 IPC)` |
| `Persons in custody or on bail during the stage of investigation at the beginning of the year` | `numeric` | 0.0% | 570 | `3263, 85, 4628` |
| `Persons arrested during the year` | `numeric` | 0.0% | 723 | `5509, 113, 1650` |
| `Persons released or freed by Police or Magistrate before trial for want of evidence or any other reason` | `numeric` | 0.0% | 266 | `0, 28, 466` |
| `Persons in custody or on bail during the stage of investigation at the end of the year` | `numeric` | 0.0% | 574 | `3138, 109, 4756` |
| `Persons in whose cases charge sheets were laid during the year` | `numeric` | 0.0% | 695 | `5634, 61, 1056` |
| `Persons under trial at the beginning of the year` | `numeric` | 0.0% | 845 | `12111, 1108, 8040` |
| `Total number of persons under trial during the year` | `numeric` | 0.0% | 869 | `17745, 1169, 9096` |
| `Persons against whom cases were compounded or withdrawn` | `numeric` | 0.0% | 252 | `2, 0, 1221` |
| `Persons in custody or on bail during the stage of trial at the end of the year` | `numeric` | 0.0% | 846 | `13142, 1161, 8183` |
| `Persons in whose cases trials were completed during the year` | `numeric` | 0.0% | 683 | `4601, 8, 913` |
| `Persons convicted` | `numeric` | 0.0% | 484 | `754, 2, 308` |
| `Persons acquitted` | `numeric` | 0.0% | 619 | `3847, 6, 605` |

# Dataset Profile: 01_District_wise_crimes_committed_IPC_2001_2012.csv (FILE_154)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/01_District_wise_crimes_committed_IPC_2001_2012.csv`
- **File Size**: 1,019,080 bytes
- **Domain Category**: `CRIME AGAINST WOMEN`
- **Data Grain**: `district_year_crime`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001-2012`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 9,017
- **Column Count**: 33
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (31)**: `YEAR, MURDER, ATTEMPT TO MURDER, CULPABLE HOMICIDE NOT AMOUNTING TO MURDER, RAPE, CUSTODIAL RAPE, OTHER RAPE, KIDNAPPING & ABDUCTION, KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS, KIDNAPPING AND ABDUCTION OF OTHERS...`
- **Categorical Columns (2)**: `STATE/UT, DISTRICT`
- **Geographic Columns**: `STATE/UT, DISTRICT, AUTO THEFT, ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY`
- **Year Columns**: `YEAR`
- **Total/Aggregate Columns**: `TOTAL IPC CRIMES`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `STATE/UT` | `categorical` | 0.0% | 35 | `ANDHRA PRADESH, ARUNACHAL PRADESH, ASSAM` |
| `DISTRICT` | `categorical` | 0.0% | 808 | `ADILABAD, ANANTAPUR, CHITTOOR` |
| `YEAR` | `numeric` | 0.0% | 12 | `2001, 2002, 2003` |
| `MURDER` | `numeric` | 0.0% | 477 | `101, 151, 80` |
| `ATTEMPT TO MURDER` | `numeric` | 0.0% | 514 | `60, 125, 57` |
| `CULPABLE HOMICIDE NOT AMOUNTING TO MURDER` | `numeric` | 0.0% | 171 | `17, 1, 2` |
| `RAPE` | `numeric` | 0.0% | 420 | `50, 23, 27` |
| `CUSTODIAL RAPE` | `numeric` | 0.0% | 5 | `0, 1, 5` |
| `OTHER RAPE` | `numeric` | 0.0% | 419 | `50, 23, 27` |
| `KIDNAPPING & ABDUCTION` | `numeric` | 0.0% | 534 | `46, 53, 59` |
| `KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS` | `numeric` | 0.0% | 460 | `30, 34, 20` |
| `KIDNAPPING AND ABDUCTION OF OTHERS` | `numeric` | 0.0% | 307 | `16, 23, 25` |
| `DACOITY` | `numeric` | 0.0% | 227 | `9, 8, 4` |
| `PREPARATION AND ASSEMBLY FOR DACOITY` | `numeric` | 0.0% | 191 | `0, 3, 1` |
| `ROBBERY` | `numeric` | 0.0% | 455 | `41, 16, 14` |
| `BURGLARY` | `numeric` | 0.0% | 922 | `198, 191, 237` |
| `THEFT` | `numeric` | 0.0% | 1751 | `199, 366, 723` |
| `AUTO THEFT` | `numeric` | 0.0% | 1114 | `22, 57, 164` |
| `OTHER THEFT` | `numeric` | 0.0% | 1343 | `177, 309, 559` |
| `RIOTS` | `numeric` | 0.0% | 804 | `78, 168, 156` |
| `CRIMINAL BREACH OF TRUST` | `numeric` | 0.0% | 411 | `16, 11, 33` |
| `CHEATING` | `numeric` | 0.0% | 824 | `104, 65, 209` |
| `COUNTERFIETING` | `numeric` | 0.0% | 167 | `1, 8, 9` |
| `ARSON` | `numeric` | 0.0% | 295 | `30, 69, 38` |
| `HURT/GREVIOUS HURT` | `numeric` | 0.0% | 1855 | `1131, 1543, 2088` |
| `DOWRY DEATHS` | `numeric` | 0.0% | 256 | `16, 7, 14` |
| `ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY` | `numeric` | 0.0% | 553 | `149, 118, 112` |
| `INSULT TO MODESTY OF WOMEN` | `numeric` | 0.0% | 343 | `34, 24, 83` |
| `CRUELTY BY HUSBAND OR HIS RELATIVES` | `numeric` | 0.0% | 846 | `175, 154, 186` |
| `IMPORTATION OF GIRLS FROM FOREIGN COUNTRIES` | `numeric` | 0.0% | 37 | `0, 7, 8` |
| `CAUSING DEATH BY NEGLIGENCE` | `numeric` | 0.0% | 854 | `181, 270, 404` |
| `OTHER IPC CRIMES` | `numeric` | 0.0% | 3173 | `1518, 754, 1262` |
| `TOTAL IPC CRIMES` | `numeric` | 0.0% | 5010 | `4154, 4125, 5818` |

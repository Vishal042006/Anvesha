# Dataset Profile: 27_Nature_of_complaints_received_by_police.csv (FILE_220)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/27_Nature_of_complaints_received_by_police.csv`
- **File Size**: 20,961 bytes
- **Domain Category**: `POLICE PERSONNEL / COMPLAINTS`
- **Data Grain**: `district_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `2001-2010`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 349
- **Column Count**: 10
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (9)**: `Year, PC1_Oral_Complaints, PC2_Written_Complaints, PC3_Distress_call_over_phoneNo_100_etc, PC4_Complaints_initiated_sue_motto_by_Police, PC5_Total_Complaints_Sum_of_1_4_Above, PC6_Total_Complaints_as_recorded_in_GD, PC7_IPC_Cases_Registered, PC8_SLL_Cases_Registered`
- **Categorical Columns (1)**: `Area_Name`
- **Geographic Columns**: `PC3_Distress_call_over_phoneNo_100_etc`
- **Year Columns**: `Year`
- **Total/Aggregate Columns**: `PC5_Total_Complaints_Sum_of_1_4_Above, PC6_Total_Complaints_as_recorded_in_GD`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 35 | `Maharashtra, Andhra Pradesh, Kerala` |
| `Year` | `numeric` | 0.0% | 10 | `2010, 2009, 2008` |
| `PC1_Oral_Complaints` | `numeric` | 4.01% | 289 | `239448.0, 242585.0, 233929.0` |
| `PC2_Written_Complaints` | `numeric` | 0.0% | 345 | `561217, 525157, 499832` |
| `PC3_Distress_call_over_phoneNo_100_etc` | `numeric` | 16.33% | 214 | `13049.0, 7697.0, 7307.0` |
| `PC4_Complaints_initiated_sue_motto_by_Police` | `numeric` | 1.72% | 307 | `549410.0, 436688.0, 404182.0` |
| `PC5_Total_Complaints_Sum_of_1_4_Above` | `numeric` | 0.0% | 349 | `1363124, 1212127, 1145250` |
| `PC6_Total_Complaints_as_recorded_in_GD` | `numeric` | 0.86% | 345 | `1106219.0, 979735.0, 1019301.0` |
| `PC7_IPC_Cases_Registered` | `numeric` | 0.0% | 344 | `208168, 199598, 206243` |
| `PC8_SLL_Cases_Registered` | `numeric` | 0.0% | 332 | `127940, 135418, 120138` |

# Dataset Profile: duplicate_report.csv (FILE_294)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/duplicate_report.csv`
- **File Size**: 21,738 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 88
- **Column Count**: 6
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (1)**: `similarity`
- **Categorical Columns (5)**: `file_a, file_b, overlap_type, decision, reason`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `file_a` | `categorical` | 0.0% | 40 | `2016 Victims of Rape.csv, NCRB_CII_2023_Table_9A.2_0 (1).csv, 01_District_wise_crimes_committed_IPC_2001_2012.csv` |
| `file_b` | `categorical` | 0.0% | 40 | `2017 Victims of Rape.csv, NCRB_CII_2023_Table_9A.2_0.csv, dstrIPC_1.csv` |
| `overlap_type` | `categorical` | 0.0% | 3 | `EXACT_FILE_DUPLICATE, TEMPORAL_SEQUENCE, SCHEMA_AND_YEAR_OVERLAP` |
| `similarity` | `numeric` | 0.0% | 3 | `1.0, 0.85, 0.9` |
| `decision` | `categorical` | 0.0% | 3 | `DUPLICATE, KEEP_BOTH, REVIEW_REQUIRED` |
| `reason` | `categorical` | 0.0% | 46 | `Identical byte hash with 2016 Victims of Rape.csv (FILE_050). Retaining 2016 Victims of Rape.csv as primary reference., Identical byte hash with NCRB_CII_2023_Table_9A.2_0 (1).csv (FILE_109). Retaining NCRB_CII_2023_Table_9A.2_0 (1).csv as primary reference., Identical byte hash with 01_District_wise_crimes_committed_IPC_2001_2012.csv (FILE_001). Retaining 01_District_wise_crimes_committed_IPC_2001_2012.csv as primary reference.` |

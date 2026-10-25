# Dataset Profile: crime_taxonomy_mapping.csv (FILE_286)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/crime_taxonomy_mapping.csv`
- **File Size**: 72,490 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 439
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (1)**: `confidence`
- **Categorical Columns (7)**: `original_crime_name, canonical_crime_name, crime_category, crime_subcategory, legal_system, legal_section, source_file`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `original_crime_name` | `categorical` | 0.0% | 439 | `MURDER, ATTEMPT TO MURDER, CULPABLE HOMICIDE NOT AMOUNTING TO MURDER` |
| `canonical_crime_name` | `categorical` | 0.0% | 118 | `Murder, Rape, Dacoity` |
| `crime_category` | `categorical` | 0.0% | 7 | `VIOLENT CRIME, CRIME AGAINST WOMEN, PROPERTY CRIME` |
| `crime_subcategory` | `categorical` | 0.0% | 13 | `Homicide, Sexual Offence, Grave Property Crime` |
| `legal_system` | `categorical` | 0.0% | 4 | `IPC, UNKNOWN, SLL` |
| `legal_section` | `categorical` | 0.0% | 14 | `Section 302 / BNS 103, Section 376 / BNS 64, Section 395 / BNS 310` |
| `source_file` | `categorical` | 0.0% | 58 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2014.csv, 02_01_District_wise_crimes_committed_against_SC_2001_2012.csv` |
| `confidence` | `numeric` | 0.0% | 2 | `0.95, 0.6` |

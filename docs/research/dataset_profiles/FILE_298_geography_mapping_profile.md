# Dataset Profile: geography_mapping.csv (FILE_298)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/geography_mapping.csv`
- **File Size**: 124,561 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,576
- **Column Count**: 10
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `historical_name, valid_from, valid_to, confidence`
- **Categorical Columns (6)**: `original_name, normalized_name, state, district, city, mapping_reason`
- **Geographic Columns**: `state, district, city`
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `historical_name, valid_to`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `original_name` | `categorical` | 0.0% | 1576 | `ADILABAD, ANANTAPUR, CHITTOOR` |
| `normalized_name` | `categorical` | 0.0% | 1170 | `Adilabad, Anantapur, Chittoor` |
| `state` | `categorical` | 0.0% | 2 | `India, Tamil Nadu` |
| `district` | `categorical` | 0.0% | 1170 | `Adilabad, Anantapur, Chittoor` |
| `city` | `categorical` | 99.62% | 6 | `Coimbatore City, Madurai City, Salem City` |
| `historical_name` | `numeric` | 100.0% | 0 | `` |
| `valid_from` | `numeric` | 0.0% | 22 | `2001, 2007, 1901` |
| `valid_to` | `numeric` | 0.0% | 1 | `2026` |
| `mapping_reason` | `categorical` | 0.0% | 4 | `Standard title-casing, Matched TN dictionary entry (Revenue District), Matched TN dictionary entry (Revenue District / City)` |
| `confidence` | `numeric` | 0.0% | 2 | `0.85, 1.0` |

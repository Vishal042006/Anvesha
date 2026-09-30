# Dataset Profile: crime_dataset_india.csv (FILE_282)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/crime_dataset_india.csv`
- **File Size**: 4,943,559 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2020`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 40,160
- **Column Count**: 14
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `Report Number, Crime Code, Victim Age, Police Deployed`
- **Categorical Columns (10)**: `Date Reported, Date of Occurrence, Time of Occurrence, City, Crime Description, Victim Gender, Weapon Used, Crime Domain, Case Closed, Date Case Closed`
- **Geographic Columns**: `City`
- **Year Columns**: `Date Reported, Date of Occurrence, Date Case Closed`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Report Number` | `numeric` | 0.0% | 40160 | `1, 2, 3` |
| `Date Reported` | `categorical` | 0.0% | 25546 | `02-01-2020 00:00, 01-01-2020 19:00, 02-01-2020 05:00` |
| `Date of Occurrence` | `categorical` | 0.0% | 40160 | `01-01-2020 00:00, 01-01-2020 01:00, 01-01-2020 02:00` |
| `Time of Occurrence` | `categorical` | 0.0% | 39886 | `01-01-2020 01:11, 01-01-2020 06:26, 01-01-2020 14:30` |
| `City` | `categorical` | 0.0% | 29 | `Ahmedabad, Chennai, Ludhiana` |
| `Crime Code` | `numeric` | 0.0% | 500 | `576, 128, 271` |
| `Crime Description` | `categorical` | 0.0% | 21 | `IDENTITY THEFT, HOMICIDE, KIDNAPPING` |
| `Victim Age` | `numeric` | 0.0% | 70 | `16, 37, 48` |
| `Victim Gender` | `categorical` | 0.0% | 3 | `M, F, X` |
| `Weapon Used` | `categorical` | 14.42% | 6 | `Blunt Object, Poison, Firearm` |
| `Crime Domain` | `categorical` | 0.0% | 4 | `Violent Crime, Other Crime, Fire Accident` |
| `Police Deployed` | `numeric` | 0.0% | 19 | `13, 9, 15` |
| `Case Closed` | `categorical` | 0.0% | 2 | `No, Yes` |
| `Date Case Closed` | `categorical` | 50.04% | 16011 | `29-04-2020 05:00, 08-01-2020 21:00, 30-03-2020 03:00` |

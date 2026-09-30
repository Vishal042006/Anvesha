# Dataset Profile: 30_Auto_theft.csv (FILE_223)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/30_Auto_theft.csv`
- **File Size**: 142,588 bytes
- **Domain Category**: `PROPERTY CRIME`
- **Data Grain**: `state_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001-2002`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,865
- **Column Count**: 7
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `Year, Auto_Theft_Coordinated/Traced, Auto_Theft_Recovered, Auto_Theft_Stolen`
- **Categorical Columns (3)**: `Area_Name, Group_Name, Sub_Group_Name`
- **Geographic Columns**: `Auto_Theft_Coordinated/Traced, Auto_Theft_Recovered, Auto_Theft_Stolen`
- **Year Columns**: `Year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 35 | `Andaman & Nicobar Islands, Andhra Pradesh, Arunachal Pradesh` |
| `Year` | `numeric` | 0.0% | 10 | `2001, 2002, 2003` |
| `Group_Name` | `categorical` | 0.0% | 6 | `AT1-Motor Cycles/ Scooters, AT2-Motor Car/Taxi/Jeep, AT3-Buses` |
| `Sub_Group_Name` | `categorical` | 0.0% | 6 | `1. Motor Cycles/ Scooters, 2. Motor Car/Taxi/Jeep, 3. Buses` |
| `Auto_Theft_Coordinated/Traced` | `numeric` | 18.55% | 256 | `136.0, 0.0, 44.0` |
| `Auto_Theft_Recovered` | `numeric` | 1.5% | 562 | `4.0, 1311.0, 21.0` |
| `Auto_Theft_Stolen` | `numeric` | 0.0% | 777 | `4, 2725, 27` |

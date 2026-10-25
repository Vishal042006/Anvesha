# Dataset Profile: 40_02_Custodial_death_person_not_remanded.csv (FILE_097)

## Metadata Summary
- **File Path**: `40_02_Custodial_death_person_not_remanded.csv`
- **File Size**: 36,261 bytes
- **Domain Category**: `POLICE PERSONNEL / COMPLAINTS`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001-2003`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 228
- **Column Count**: 11
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (8)**: `Year, CD_Deaths_Reported, CD_No_of_Autopsy_conducted, CD_No_of_Cases_registered_in_connection_with_deaths, CD_No_of_Judicial_enquiry_orderedconducted, CD_No_of_Magisterial_enquiry_orderedconducted, CD_No_of_Policemen_Charge_sheeted, CD_No_of_Policemen_Convicted`
- **Categorical Columns (3)**: `Area_Name, Group_Name, Sub_Group_Name`
- **Geographic Columns**: `CD_No_of_Autopsy_conducted`
- **Year Columns**: `Year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `Group_Name, Sub_Group_Name`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 30 | `Andhra Pradesh, Arunachal Pradesh, Assam` |
| `Year` | `numeric` | 0.0% | 10 | `2001, 2002, 2003` |
| `Group_Name` | `categorical` | 0.0% | 1 | `Persons Not Remand to Police Custody by Court` |
| `Sub_Group_Name` | `categorical` | 0.0% | 1 | `2. Deaths in Custody/Lockup of Persons Not Remanded to Police Custody by Court` |
| `CD_Deaths_Reported` | `numeric` | 0.0% | 17 | `8, 0, 2` |
| `CD_No_of_Autopsy_conducted` | `numeric` | 1.32% | 16 | `8.0, 0.0, 2.0` |
| `CD_No_of_Cases_registered_in_connection_with_deaths` | `numeric` | 3.51% | 11 | `2.0, 0.0, 1.0` |
| `CD_No_of_Judicial_enquiry_orderedconducted` | `numeric` | 14.04% | 6 | `1.0, 0.0, 2.0` |
| `CD_No_of_Magisterial_enquiry_orderedconducted` | `numeric` | 3.51% | 12 | `5.0, 0.0, 2.0` |
| `CD_No_of_Policemen_Charge_sheeted` | `numeric` | 16.23% | 11 | `1.0, 0.0, 13.0` |
| `CD_No_of_Policemen_Convicted` | `numeric` | 19.3% | 5 | `0.0, 2.0, 3.0` |

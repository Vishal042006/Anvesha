# Dataset Profile: 40_03_Custodial_death_during_production.csv (FILE_079)

## Metadata Summary
- **File Path**: `40_03_Custodial_death_during_production.csv`
- **File Size**: 40,925 bytes
- **Domain Category**: `POLICE PERSONNEL / COMPLAINTS`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `2001-2003`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 204
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
| `Area_Name` | `categorical` | 0.0% | 28 | `Andhra Pradesh, Arunachal Pradesh, Assam` |
| `Year` | `numeric` | 0.0% | 10 | `2001, 2002, 2003` |
| `Group_Name` | `categorical` | 0.0% | 1 | `During Production/Process in Courts/Journey Connected with Investigation` |
| `Sub_Group_Name` | `categorical` | 0.0% | 1 | `3. Deaths in Custody during production/process in courts/journey connected with investigation` |
| `CD_Deaths_Reported` | `numeric` | 0.0% | 10 | `3, 0, 1` |
| `CD_No_of_Autopsy_conducted` | `numeric` | 2.94% | 8 | `3.0, 0.0, 1.0` |
| `CD_No_of_Cases_registered_in_connection_with_deaths` | `numeric` | 3.92% | 6 | `3.0, 0.0, 1.0` |
| `CD_No_of_Judicial_enquiry_orderedconducted` | `numeric` | 7.84% | 5 | `1.0, 0.0, 2.0` |
| `CD_No_of_Magisterial_enquiry_orderedconducted` | `numeric` | 5.39% | 7 | `1.0, 0.0, 6.0` |
| `CD_No_of_Policemen_Charge_sheeted` | `numeric` | 8.82% | 8 | `0.0, 1.0, 8.0` |
| `CD_No_of_Policemen_Convicted` | `numeric` | 9.8% | 3 | `0.0, 9.0, 10.0` |

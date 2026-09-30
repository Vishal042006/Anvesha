# Dataset Profile: data_inventory.csv (FILE_289)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/data_inventory.csv`
- **File Size**: 134,041 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `district_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `district`
- **Detected Geography**: `India (Includes Tamil Nadu)`
- **Detected Year**: `1904-2090`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 146
- **Column Count**: 22
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (4)**: `file_size_bytes, number_of_rows, number_of_columns, quality_score`
- **Categorical Columns (18)**: `file_id, filename, relative_path, extension, column_names, detected_year, year_range, detected_state, detected_district, geography_level...`
- **Geographic Columns**: `detected_state, detected_district`
- **Year Columns**: `detected_year, year_range, duplicate_candidate`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `whether_aggregate_or_individual`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `file_id` | `categorical` | 0.0% | 146 | `FILE_001, FILE_002, FILE_003` |
| `filename` | `categorical` | 0.0% | 146 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `relative_path` | `categorical` | 0.0% | 146 | `01_District_wise_crimes_committed_IPC_2001_2012.csv, 01_District_wise_crimes_committed_IPC_2013.csv, 01_District_wise_crimes_committed_IPC_2014.csv` |
| `extension` | `categorical` | 0.0% | 2 | `.csv, .pdf` |
| `file_size_bytes` | `numeric` | 0.0% | 140 | `1019080, 95088, 205809` |
| `number_of_rows` | `numeric` | 0.0% | 67 | `9017, 823, 838` |
| `number_of_columns` | `numeric` | 0.0% | 37 | `33, 91, 13` |
| `column_names` | `categorical` | 2.05% | 106 | `STATE/UT|DISTRICT|YEAR|MURDER|ATTEMPT TO MURDER|CULPABLE HOMICIDE NOT AMOUNTING TO MURDER|RAPE|CUSTODIAL RAPE|OTHER RAPE|KIDNAPPING & ABDUCTION|KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS|KIDNAPPING AND ABDUCTION OF OTHERS|DACOITY|PREPARATION AND ASSEMBLY FOR DACOITY|ROBBERY|BURGLARY|THEFT|AUTO THEFT|OTHER THEFT|RIOTS|CRIMINAL BREACH OF TRUST|CHEATING|COUNTERFIETING|ARSON|HURT/GREVIOUS HURT|DOWRY DEATHS|ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY|INSULT TO MODESTY OF WOMEN|CRUELTY BY HUSBAND OR HIS RELATIVES|IMPORTATION OF GIRLS FROM FOREIGN COUNTRIES|CAUSING DEATH BY NEGLIGENCE|OTHER IPC CRIMES|TOTAL IPC CRIMES, States/UTs|District|Year|Murder|Attempt to commit Murder|Culpable Homicide not amounting to Murder|Attempt to commit Culpable Homicide|Rape|Custodial Rape|Custodial_Gang Rape|Custodial_Other Rape|Rape other than Custodial|Rape_Gang Rape|Rape_Others|Attempt to commit Rape|Kidnapping & Abduction_Total|Kidnapping & Abduction|Kidnapping & Abduction in order to Murder|Kidnapping for Ransom|Kidnapping & Abduction of Women to compel her for marriage|Other Kidnapping|Dacoity|Dacoity with Murder|Other Dacoity|Making Preparation and Assembly for committing Dacoity|Robbery|Criminal Trespass/Burglary|Criminal Trespass or Burglary|House Trespass & House Breaking|Theft|Auto Theft|Other Thefts|Unlawful Assembly|Riots|Riots_Communal|Riots_Industrial|Riots_Political|Riots_Caste Conflict|Riots_SC/STs Vs Non-SCs/STs|Riots_Other Caste Conflict|Riots_Agrarian|Riots_Students|Riots_Sectarian|Riots_Others|Criminal Breach of Trust|Cheating|Forgery|Counterfeiting|Counterfeit Offences related to Counterfeit Coin|Counterfeiting Government Stamp|Counterfeit currency & Bank notes|Counterfeiting currency notes/Bank notes|Using forged or counterfeiting currency/Bank notes|Possession of forged or counterfeiting currency/Bank notes|Making or Possessing materials for forged currency/Bank notes|Making or Using documents resembling currency|Arson|Grievous Hurt|Hurt|Acid attack|Attempt to Acid Attack|Dowry Deaths|Assault on Women with intent to outrage her Modesty|Sexual Harassment|Assault or use of criminal force to women with intent to Disrobe|Voyeurism|Stalking|Other Assault on Women|Insult to the Modesty of Women|At Office premises|Other places related to work|In Public Transport system|Places other than 231, 232 & 233|Cruelty by Husband or his Relatives|Importation of Girls from Foreign Country|Causing Death by Negligence|Deaths due to negligent driving/act|Deaths due to Other Causes|Offences against State|Sedition|Other offences against State|Offences promoting enmity between different groups|Promoting enmity between different groups|Imputation, assertions prejudicial to national integration|Extortion|Disclosure of Identity of Victims|Incidence of Rash Driving|HumanTrafficking|Unnatural Offence|Other IPC crimes|Total Cognizable IPC crimes, STATE/UT|DISTRICT|Year|Murder|Rape|Kidnapping and Abduction|Dacoity|Robbery|Arson|Hurt|Prevention of atrocities (POA) Act|Protection of Civil Rights (PCR) Act|Other Crimes Against SCs` |
| `detected_year` | `categorical` | 0.0% | 42 | `2001-2012, 2013, 2014` |
| `year_range` | `categorical` | 0.0% | 42 | `2001-2012, 2013, 2014` |
| `detected_state` | `categorical` | 0.0% | 4 | `India / Multi-State, India (Includes Tamil Nadu), UNKNOWN` |
| `detected_district` | `categorical` | 0.0% | 2 | `UNKNOWN, Dindigul` |
| `geography_level` | `categorical` | 0.0% | 3 | `district, state, UNKNOWN` |
| `data_grain` | `categorical` | 0.0% | 8 | `district_year_crime, state_year_crime_disposal, state_year_crime` |
| `dataset_category` | `categorical` | 0.0% | 14 | `CRIME AGAINST WOMEN, CRIME AGAINST CHILDREN, ARRESTS / POLICE DISPOSAL` |
| `source_organization` | `categorical` | 0.0% | 2 | `NCRB / MHA India, Tamil Nadu SCRB` |
| `likely_source` | `categorical` | 0.0% | 2 | `National Crime Records Bureau (NCRB) / Ministry of Home Affairs, Tamil Nadu State Crime Records Bureau (SCRB)` |
| `whether_aggregate_or_individual` | `categorical` | 0.0% | 1 | `Aggregate Statistics` |
| `duplicate_candidate` | `categorical` | 0.0% | 6 | `NO, YES (Identical content to FILE_050), YES (Identical content to FILE_109)` |
| `schema_group` | `categorical` | 0.0% | 98 | `GRP_33_39fc81, GRP_91_74207a, GRP_13_a32b1e` |
| `quality_score` | `numeric` | 0.0% | 4 | `100, 90, 30` |
| `notes` | `categorical` | 0.0% | 8 | `Clean parse, 2 duplicate rows, 1 duplicate rows` |

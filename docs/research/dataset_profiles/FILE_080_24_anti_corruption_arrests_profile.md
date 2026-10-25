# Dataset Profile: 24_Anti_corruption_arrests.csv (FILE_080)

## Metadata Summary
- **File Path**: `24_Anti_corruption_arrests.csv`
- **File Size**: 65,123 bytes
- **Domain Category**: `ARRESTS / POLICE DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1903-2081`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 347
- **Column Count**: 24
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (23)**: `Year, ACA01_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_beginning_of_the_year, ACA02_No_of_persons_arrested_during_the_year, ACA04_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_end_of_the_year, ACA05_No_of_persons_in_whose_cases_charge_sheets_were_laid_during_the_year, ACA06_No_of_persons_under_trial_at_the_beginning_of_the_year, ACA07_Total_No_of_persons_under_trial_during_the_year, ACA08_No_of_persons_whose_cases_were_withdrawn_or_otherwise_disposed_off_during_the_year, ACA09_No_of_persons_in_custody_or_on_bail_during_the_stage_of_trial_at_the_end_of_the_year, ACA10_No_of_persons_in_whose_cases_trials_were_completed_during_the_year...`
- **Categorical Columns (1)**: `Area_Name`
- **Geographic Columns**: `ACA171_No_of_Group_`A'_Officers_out_of_above, ACA172_No_of_Group_`B'_Officers_out_of_above`
- **Year Columns**: `Year, ACA01_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_beginning_of_the_year, ACA02_No_of_persons_arrested_during_the_year, ACA04_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_end_of_the_year, ACA05_No_of_persons_in_whose_cases_charge_sheets_were_laid_during_the_year, ACA06_No_of_persons_under_trial_at_the_beginning_of_the_year, ACA07_Total_No_of_persons_under_trial_during_the_year, ACA08_No_of_persons_whose_cases_were_withdrawn_or_otherwise_disposed_off_during_the_year, ACA09_No_of_persons_in_custody_or_on_bail_during_the_stage_of_trial_at_the_end_of_the_year, ACA10_No_of_persons_in_whose_cases_trials_were_completed_during_the_year, ACA11_No_of_persons_convicted_during_the_year, ACA12_No_of_persons_acquitted_during_the_year, ACA13_Percentage_of_persons_convicted_to_total_persons_in_whose_cases_trials_were_completed_during_the_year, ACA14_No_of_persons_involved_in_the_cases_reported_for_Regular_Departmental_Action_during_the_year, ACA15_No_of_persons_involved_in_the_cases_reported_for_suitable_action_during_the_year, ACA16_No_of_persons_punished_departmentally_during_the_year:, ACA161_No_of_persons_dismissed_from_Service_during_the_year, ACA162_No_of_persons_removed_from_service_during_the_year, ACA163_No_of_persons_awarded_other_major_punishments_during_the_year, ACA164_No_of_persons_awarded_minor_punishments_during_the_year, ACA19_No_of_private_persons_involved_during_the_year`
- **Total/Aggregate Columns**: `ACA07_Total_No_of_persons_under_trial_during_the_year, ACA13_Percentage_of_persons_convicted_to_total_persons_in_whose_cases_trials_were_completed_during_the_year`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 35 | `Bihar, Gujarat, Maharashtra` |
| `Year` | `numeric` | 0.0% | 10 | `2007, 2010, 2003` |
| `ACA01_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_beginning_of_the_year` | `numeric` | 0.0% | 160 | `13.0, 144.0, 775.0` |
| `ACA02_No_of_persons_arrested_during_the_year` | `numeric` | 0.0% | 154 | `950.0, 947.0, 870.0` |
| `ACA04_No_of_persons_in_custody_or_on_bail_during_the_stage_of_investigation_at_the_end_of_the_year` | `numeric` | 0.0% | 162 | `20.0, 449.0, 1188.0` |
| `ACA05_No_of_persons_in_whose_cases_charge_sheets_were_laid_during_the_year` | `numeric` | 0.0% | 155 | `943.0, 642.0, 453.0` |
| `ACA06_No_of_persons_under_trial_at_the_beginning_of_the_year` | `numeric` | 0.0% | 215 | `0.0, 959.0, 3588.0` |
| `ACA07_Total_No_of_persons_under_trial_during_the_year` | `numeric` | 0.0% | 221 | `0.0, 1601.0, 4041.0` |
| `ACA08_No_of_persons_whose_cases_were_withdrawn_or_otherwise_disposed_off_during_the_year` | `numeric` | 0.0% | 47 | `4.0, 0.0, 21.0` |
| `ACA09_No_of_persons_in_custody_or_on_bail_during_the_stage_of_trial_at_the_end_of_the_year` | `numeric` | 0.0% | 217 | `0.0, 1378.0, 3553.0` |
| `ACA10_No_of_persons_in_whose_cases_trials_were_completed_during_the_year` | `numeric` | 0.0% | 141 | `4.0, 223.0, 467.0` |
| `ACA11_No_of_persons_convicted_during_the_year` | `numeric` | 0.0% | 90 | `4.0, 51.0, 97.0` |
| `ACA12_No_of_persons_acquitted_during_the_year` | `numeric` | 0.0% | 120 | `0.0, 172.0, 370.0` |
| `ACA13_Percentage_of_persons_convicted_to_total_persons_in_whose_cases_trials_were_completed_during_the_year` | `numeric` | 0.0% | 19 | `0.0, 39.0, 31.4` |
| `ACA14_No_of_persons_involved_in_the_cases_reported_for_Regular_Departmental_Action_during_the_year` | `numeric` | 0.0% | 70 | `0.0, 5.0, 10.0` |
| `ACA15_No_of_persons_involved_in_the_cases_reported_for_suitable_action_during_the_year` | `numeric` | 0.29% | 47 | `0.0, 35.0, 26.0` |
| `ACA16_No_of_persons_punished_departmentally_during_the_year:` | `numeric` | 0.0% | 32 | `0.0, 6.0, 3.0` |
| `ACA161_No_of_persons_dismissed_from_Service_during_the_year` | `numeric` | 0.29% | 20 | `0.0, 1.0, 8.0` |
| `ACA162_No_of_persons_removed_from_service_during_the_year` | `numeric` | 0.29% | 12 | `0.0, 1.0, 7.0` |
| `ACA163_No_of_persons_awarded_other_major_punishments_during_the_year` | `numeric` | 0.0% | 28 | `0.0, 2.0, 1.0` |
| `ACA164_No_of_persons_awarded_minor_punishments_during_the_year` | `numeric` | 0.0% | 28 | `0.0, 3.0, 1.0` |
| `ACA171_No_of_Group_`A'_Officers_out_of_above` | `numeric` | 0.0% | 60 | `246.0, 9.0, 88.0` |
| `ACA172_No_of_Group_`B'_Officers_out_of_above` | `numeric` | 0.0% | 81 | `150.0, 46.0, 72.0` |
| `ACA19_No_of_private_persons_involved_during_the_year` | `numeric` | 0.0% | 89 | `215.0, 35.0, 73.0` |

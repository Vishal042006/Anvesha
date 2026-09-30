# Dataset Profile: 23_Anti_corruprion_cases.csv (FILE_079)

## Metadata Summary
- **File Path**: `23_Anti_corruprion_cases.csv`
- **File Size**: 80,281 bytes
- **Domain Category**: `COURT DISPOSAL`
- **Data Grain**: `state_year_crime_disposal`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `state`
- **Detected Geography**: `India / Multi-State`
- **Detected Year**: `1901-2098`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 346
- **Column Count**: 29
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (28)**: `Year, AC01_No_of_cases_pending_investigation_from_previous_year, AC02_No_of_cases_registered_during_the_year, AC03_Total_No_of_cases_for_investigation_during_the_year, AC04_No_of_cases_investigated_during_the_year, AC05_No_of_cases_not_investigatedor_in_which_investigation_was_dropped_due_to_any_reason_during_the_year, AC06_No_of_cases_transferred_to_local_police_during_the_year, AC07_No_of_cases_declared_false_mistake_of_fact_or_of_law_or_non_cognizable_or_civil_in_nature, AC08_No_of_cases_in_which_charge_sheets_were_laid_during_the_year, AC09_No_of_cases_pending_departmental_sanction_for_prosecution_during_the_year...`
- **Categorical Columns (1)**: `Area_Name`
- **Geographic Columns**: `AC09_No_of_cases_pending_departmental_sanction_for_prosecution_during_the_year, AC13_No_of_cases_in_which_charge_sheets_were_not_laid_but_final_report_submitted_during_the_year`
- **Year Columns**: `Year, AC01_No_of_cases_pending_investigation_from_previous_year, AC02_No_of_cases_registered_during_the_year, AC03_Total_No_of_cases_for_investigation_during_the_year, AC04_No_of_cases_investigated_during_the_year, AC05_No_of_cases_not_investigatedor_in_which_investigation_was_dropped_due_to_any_reason_during_the_year, AC06_No_of_cases_transferred_to_local_police_during_the_year, AC08_No_of_cases_in_which_charge_sheets_were_laid_during_the_year, AC09_No_of_cases_pending_departmental_sanction_for_prosecution_during_the_year, AC10_No_of_cases_sent_up_for_trial_and_also_reported_for_departmental_action_during_the_year, AC11_No_of_cases_reported_for_regular_departmental_action_during_the_year, AC12_No_of_cases_reported_for_suitable_action_during_the_year, AC13_No_of_cases_in_which_charge_sheets_were_not_laid_but_final_report_submitted_during_the_year, AC14_No_of_cases_pending_investigation_at_the_end_of_the_year, AC15_No_of_cases_resulted_in_recoveries_or_seizures_during_the_year, AC16_Value_of_property_recoveredseized_during_the_year_in_Rs, AC18_No_of_cases_pending_trial_from_the_previous_year, AC19_No_of_cases_sent_up_for_trial_during_the_year, AC20_Total_No_of_cases_for_trial_during_the_year, AC21_No_of_cases_withdrawn_or_other_wise_disposed_off_on_account_of_death_of_the_accused_during_the_year, AC22_No_of_cases_in_which_trials_were_completed_during_the_year, AC23_No_of_cases_convicted_during_the_year, AC24_No_of_cases_acquitted_or_discharged_during_the_year, AC25_No_of_cases_pending_trial_at_the_end_of_the_year, AC26_Percentage_of_cases_convicted_to_cases_in_which_trials_were_completed_during_the_year, AC27_Total_amount_of_fine_imposed_during_the_year_in_Rs`
- **Total/Aggregate Columns**: `AC03_Total_No_of_cases_for_investigation_during_the_year, AC17_Percentage_of_cases_charge_sheeted_to_total_cases_investigated, AC20_Total_No_of_cases_for_trial_during_the_year, AC27_Total_amount_of_fine_imposed_during_the_year_in_Rs`
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `Area_Name` | `categorical` | 0.0% | 35 | `Rajasthan, Maharashtra, Tamil Nadu` |
| `Year` | `numeric` | 0.0% | 10 | `2010, 2003, 2009` |
| `AC01_No_of_cases_pending_investigation_from_previous_year` | `numeric` | 0.0% | 174 | `740.0, 724.0, 509.0` |
| `AC02_No_of_cases_registered_during_the_year` | `numeric` | 0.0% | 149 | `576.0, 528.0, 521.0` |
| `AC03_Total_No_of_cases_for_investigation_during_the_year` | `numeric` | 0.0% | 203 | `1316.0, 1252.0, 1030.0` |
| `AC04_No_of_cases_investigated_during_the_year` | `numeric` | 0.0% | 198 | `1316.0, 1252.0, 1030.0` |
| `AC05_No_of_cases_not_investigatedor_in_which_investigation_was_dropped_due_to_any_reason_during_the_year` | `numeric` | 0.0% | 21 | `0.0, 2.0, 3.0` |
| `AC06_No_of_cases_transferred_to_local_police_during_the_year` | `numeric` | 0.0% | 8 | `0.0, 3.0, 6.0` |
| `AC07_No_of_cases_declared_false_mistake_of_fact_or_of_law_or_non_cognizable_or_civil_in_nature` | `numeric` | 0.0% | 32 | `0.0, 4.0, 1.0` |
| `AC08_No_of_cases_in_which_charge_sheets_were_laid_during_the_year` | `numeric` | 0.0% | 140 | `281.0, 446.0, 479.0` |
| `AC09_No_of_cases_pending_departmental_sanction_for_prosecution_during_the_year` | `numeric` | 0.0% | 102 | `196.0, 250.0, 237.0` |
| `AC10_No_of_cases_sent_up_for_trial_and_also_reported_for_departmental_action_during_the_year` | `numeric` | 0.0% | 75 | `126.0, 1.0, 0.0` |
| `AC11_No_of_cases_reported_for_regular_departmental_action_during_the_year` | `numeric` | 0.0% | 58 | `126.0, 37.0, 2.0` |
| `AC12_No_of_cases_reported_for_suitable_action_during_the_year` | `numeric` | 0.0% | 31 | `48.0, 0.0, 19.0` |
| `AC13_No_of_cases_in_which_charge_sheets_were_not_laid_but_final_report_submitted_during_the_year` | `numeric` | 0.0% | 76 | `70.0, 26.0, 44.0` |
| `AC14_No_of_cases_pending_investigation_at_the_end_of_the_year` | `numeric` | 0.0% | 174 | `965.0, 780.0, 520.0` |
| `AC15_No_of_cases_resulted_in_recoveries_or_seizures_during_the_year` | `numeric` | 0.0% | 108 | `225.0, 155.0, 154.0` |
| `AC16_Value_of_property_recoveredseized_during_the_year_in_Rs` | `numeric` | 0.0% | 174 | `1481450.0, 28841870.0, 9114731.0` |
| `AC17_Percentage_of_cases_charge_sheeted_to_total_cases_investigated` | `numeric` | 0.0% | 32 | `0.0, 27.5, 29.0` |
| `AC18_No_of_cases_pending_trial_from_the_previous_year` | `numeric` | 0.0% | 191 | `1817.0, 2042.0, 2602.0` |
| `AC19_No_of_cases_sent_up_for_trial_during_the_year` | `numeric` | 0.0% | 136 | `281.0, 446.0, 479.0` |
| `AC20_Total_No_of_cases_for_trial_during_the_year` | `numeric` | 0.0% | 199 | `2098.0, 2488.0, 3081.0` |
| `AC21_No_of_cases_withdrawn_or_other_wise_disposed_off_on_account_of_death_of_the_accused_during_the_year` | `numeric` | 0.0% | 23 | `8.0, 5.0, 13.0` |
| `AC22_No_of_cases_in_which_trials_were_completed_during_the_year` | `numeric` | 0.0% | 120 | `57.0, 366.0, 396.0` |
| `AC23_No_of_cases_convicted_during_the_year` | `numeric` | 0.0% | 81 | `11.0, 68.0, 113.0` |
| `AC24_No_of_cases_acquitted_or_discharged_during_the_year` | `numeric` | 0.0% | 105 | `46.0, 298.0, 283.0` |
| `AC25_No_of_cases_pending_trial_at_the_end_of_the_year` | `numeric` | 0.0% | 193 | `2033.0, 2117.0, 2680.0` |
| `AC26_Percentage_of_cases_convicted_to_cases_in_which_trials_were_completed_during_the_year` | `numeric` | 0.0% | 24 | `0.0, 31.2, 18.8` |
| `AC27_Total_amount_of_fine_imposed_during_the_year_in_Rs` | `numeric` | 0.0% | 154 | `33750.0, 383000.0, 404600.0` |

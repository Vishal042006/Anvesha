# Dataset Profile: FEATURE_USAGE_REGISTRY.csv (FILE_124)

## Metadata Summary
- **File Path**: `FEATURE_USAGE_REGISTRY.csv`
- **File Size**: 1,339 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 16
- **Column Count**: 4
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (0)**: ``
- **Categorical Columns (4)**: `feature_name, status, usage_rule, leakage_risk`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `None`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `feature_name` | `categorical` | 0.0% | 16 | `previous_year_crime, two_year_avg, three_year_avg` |
| `status` | `categorical` | 0.0% | 5 | `SAFE, CONDITIONAL, POST_OUTCOME` |
| `usage_rule` | `categorical` | 0.0% | 13 | `Retrospective 1-year lag feature., Retrospective 2-year rolling average., Retrospective 3-year rolling average.` |
| `leakage_risk` | `categorical` | 0.0% | 4 | `NONE, MODERATE, HIGH` |

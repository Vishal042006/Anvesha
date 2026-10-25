# Dataset Profile: GRAPH_QUALITY_REPORT.csv (FILE_253)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/GRAPH_QUALITY_REPORT.csv`
- **File Size**: 325 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 5
- **Column Count**: 5
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (2)**: `issue_count, recommendation`
- **Categorical Columns (3)**: `check_name, status, details`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `status, issue_count, recommendation`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `check_name` | `categorical` | 0.0% | 5 | `NODE_ID_UNIQUENESS, EDGE_SOURCE_EXISTENCE, EDGE_TARGET_EXISTENCE` |
| `status` | `categorical` | 0.0% | 1 | `PASS` |
| `issue_count` | `numeric` | 0.0% | 1 | `0` |
| `details` | `categorical` | 0.0% | 5 | `Duplicate node_ids found: 0, Orphan edge sources: 0, Orphan edge targets: 0` |
| `recommendation` | `numeric` | 100.0% | 0 | `` |

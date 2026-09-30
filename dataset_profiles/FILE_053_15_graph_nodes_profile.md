# Dataset Profile: 15_graph_nodes.csv (FILE_053)

## Metadata Summary
- **File Path**: `15_graph_nodes.csv`
- **File Size**: 177,944 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,449
- **Column Count**: 8
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (2)**: `source_page, confidence`
- **Categorical Columns (6)**: `node_id, node_type, name, normalized_name, source, source_file`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `source_page`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `node_id` | `categorical` | 0.0% | 1449 | `NODE_STATE_TN, NODE_STATE_IN, NODE_DIST_34d4b88f` |
| `node_type` | `categorical` | 0.0% | 5 | `STATE, DISTRICT, CRIME_CATEGORY` |
| `name` | `categorical` | 0.0% | 1449 | `Tamil Nadu, India, Adilabad` |
| `normalized_name` | `categorical` | 0.0% | 1449 | `Tamil Nadu, India, Adilabad` |
| `source` | `categorical` | 0.0% | 7 | `SCRB / Government of Tamil Nadu, NCRB / Ministry of Home Affairs, Tamil Nadu SCRB / Revenue Dept` |
| `source_file` | `categorical` | 0.0% | 148 | `SYSTEM, geography_mapping.csv, 01_District_wise_crimes_committed_IPC_2001_2012.csv` |
| `source_page` | `numeric` | 100.0% | 0 | `` |
| `confidence` | `numeric` | 0.0% | 4 | `1.0, 0.85, 0.95` |

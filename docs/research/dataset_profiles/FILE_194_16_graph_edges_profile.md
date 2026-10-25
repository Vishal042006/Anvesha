# Dataset Profile: 16_graph_edges.csv (FILE_194)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/16_graph_edges.csv`
- **File Size**: 211,293 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `unknown`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `UNKNOWN`
- **Quality Score**: `100/100`

## Dimensions
- **Row Count**: 1,183
- **Column Count**: 10
- **Duplicate Rows**: 0

## Column Classification
- **Numeric Columns (3)**: `source_page, source_table, confidence`
- **Categorical Columns (7)**: `edge_id, source_node, relationship, target_node, source_file, evidence, relationship_type`
- **Geographic Columns**: ``
- **Year Columns**: ``
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `source_page, source_table`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `edge_id` | `categorical` | 0.0% | 1183 | `EDGE_NODE_DIST_34d4b88f_LOCATED_IN_NODE_STATE_TN, EDGE_NODE_DIST_3c14de13_LOCATED_IN_NODE_STATE_TN, EDGE_NODE_DIST_4d9d89ac_LOCATED_IN_NODE_STATE_TN` |
| `source_node` | `categorical` | 0.0% | 1183 | `NODE_DIST_34d4b88f, NODE_DIST_3c14de13, NODE_DIST_4d9d89ac` |
| `relationship` | `categorical` | 0.0% | 2 | `LOCATED_IN, GOVERNED_BY_LAW` |
| `target_node` | `categorical` | 0.0% | 14 | `NODE_STATE_TN, NODE_LAW_19fb7f94, NODE_LAW_de56f5d1` |
| `source_file` | `categorical` | 0.0% | 5 | `geography_mapping.csv, 01_District_wise_crimes_committed_IPC_2001_2012.csv, 02_01_District_wise_crimes_committed_against_SC_2001_2012.csv` |
| `source_page` | `numeric` | 100.0% | 0 | `` |
| `source_table` | `numeric` | 100.0% | 0 | `` |
| `evidence` | `categorical` | 0.0% | 1183 | `District Adilabad is located in Tamil Nadu, District Anantapur is located in Tamil Nadu, District Chittoor is located in Tamil Nadu` |
| `confidence` | `numeric` | 0.0% | 2 | `1.0, 0.95` |
| `relationship_type` | `categorical` | 0.0% | 2 | `SPATIAL, LEGAL` |

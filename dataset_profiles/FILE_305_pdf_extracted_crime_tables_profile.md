# Dataset Profile: pdf_extracted_crime_tables.csv (FILE_305)

## Metadata Summary
- **File Path**: `anvesha_training_data/00_raw/csv/pdf_extracted_crime_tables.csv`
- **File Size**: 65,568,195 bytes
- **Domain Category**: `GENERAL CRIME / IPC`
- **Data Grain**: `state_year`
- **Source Organization**: `NCRB / MHA India`
- **Geography Level**: `UNKNOWN`
- **Detected Geography**: `UNKNOWN`
- **Detected Year**: `2007`
- **Quality Score**: `90/100`

## Dimensions
- **Row Count**: 196,210
- **Column Count**: 11
- **Duplicate Rows**: 372

## Column Classification
- **Numeric Columns (3)**: `page_number, table_number, confidence`
- **Categorical Columns (8)**: `source_pdf, file_id, table_title, detected_year, geography, crime_category, row_data, extraction_method`
- **Geographic Columns**: ``
- **Year Columns**: `detected_year`
- **Total/Aggregate Columns**: ``
- **Constant Columns**: `crime_category, extraction_method, confidence`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
| `source_pdf` | `categorical` | 0.0% | 9 | `2007cf3a-9d24-4262-8361-8c59303d334e.pdf, 2ac03f2a-fdc7-43c4-8fbf-47b963e34804.pdf, 474d4eed-f4f8-47bb-aab9-a85771cb478a.pdf` |
| `file_id` | `categorical` | 0.0% | 9 | `FILE_047, FILE_066, FILE_088` |
| `page_number` | `numeric` | 0.0% | 764 | `7, 8, 9` |
| `table_number` | `numeric` | 0.0% | 5 | `1, 2, 3` |
| `table_title` | `categorical` | 0.0% | 183 | `CHAPTER &
TABLE NO., S.
No., S. No.` |
| `detected_year` | `categorical` | 0.0% | 3 | `2007, UNKNOWN, 2023` |
| `geography` | `categorical` | 0.0% | 2 | `UNKNOWN, Tamil Nadu` |
| `crime_category` | `categorical` | 0.0% | 1 | `COMPREHENSIVE CRIME REPORT / PDF` |
| `row_data` | `categorical` | 0.0% | 165726 | `CHAPTER &
TABLE NO.:CHAPTER 1 | TITLE:INCIDENCE AND RATE OF COGNIZABLE CRIMES, CHAPTER &
TABLE NO.:1.1 | TITLE:Nature and Number of Complaints Received by Police and Cases Registered During
2017 | PAGES:3, CHAPTER &
TABLE NO.:1.2 | TITLE:Incidence & Rate of Total Cognizable Crimes Under Indian Penal Code (IPC) And
Special & Local Laws (SLL) During 2007-2017 | PAGES:5` |
| `extraction_method` | `categorical` | 0.0% | 1 | `pdfplumber` |
| `confidence` | `numeric` | 0.0% | 1 | `0.95` |

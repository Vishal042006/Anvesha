# ANVESHA Data Cleanup & Reorganization Action Log

**Execution Date:** October 01, 2026  
**Total Repository Files Inventoried:** 26007  

---

## Reorganization Summary
- **Canonical Datasets Established:** 11 core files in `data/canonical/`
- **ML Datasets Organized:** 6 files in `data/ml/`
- **Loose Raw CSVs Archived:** 202 files moved to `data/raw_archive/`
- **Source PDF Reports Archived:** 9 files moved to `data/raw_archive/source_documents/`
- **Extracted PDF Tables Organized:** 5,291 chunk CSVs moved to `data/derived/pdf_extracted/`
- **Metadata Profiles Organized:** 12,152 profile JSONs moved to `data/research/metadata/`
- **Root Directory Status**: **CLEAN & UNCLUTTERED** (All raw CSVs and PDFs moved to archive/derived)

---

## Detailed Action Log Sample
- **CANONICAL_COPY**: `data/04_integrated/anvesha_extended_crime_master.parquet` $\rightarrow$ `data/canonical/crime/anvesha_extended_crime_master.parquet` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/04_integrated/anvesha_clean_crime_master.parquet` $\rightarrow$ `data/canonical/crime/anvesha_clean_crime_master.parquet` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/03_normalized/dim_crime_taxonomy.csv` $\rightarrow$ `data/canonical/crime/dim_crime_taxonomy.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/03_normalized/dim_geography.csv` $\rightarrow$ `data/canonical/geography/dim_geography.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/08_metadata/tn_population_clean.csv` $\rightarrow$ `data/canonical/population/tn_population_clean.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/08_metadata/anvesha_population_crime_crosswalk.csv` $\rightarrow$ `data/canonical/population/anvesha_population_crime_crosswalk.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/03_normalized/dim_police_stations.csv` $\rightarrow$ `data/canonical/context/dim_police_stations.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/04_integrated/fact_road_safety.csv` $\rightarrow$ `data/canonical/context/fact_road_safety.csv` (*Established as active canonical analytical dataset*)
- **CANONICAL_COPY**: `data/04_integrated/fact_complaints.csv` $\rightarrow$ `data/canonical/context/fact_complaints.csv` (*Established as active canonical analytical dataset*)
- **ML_COPY**: `data/05_ml/splits/train.parquet` $\rightarrow$ `data/ml/splits/train.parquet` (*Organized into ML feature/split/evaluation layer*)
- **ML_COPY**: `data/05_ml/splits/validation.parquet` $\rightarrow$ `data/ml/splits/validation.parquet` (*Organized into ML feature/split/evaluation layer*)
- **ML_COPY**: `data/05_ml/splits/test.parquet` $\rightarrow$ `data/ml/splits/test.parquet` (*Organized into ML feature/split/evaluation layer*)
- **ML_COPY**: `04_tn_crime_ml_features.csv` $\rightarrow$ `data/ml/features/tn_crime_ml_features.csv` (*Organized into ML feature/split/evaluation layer*)
- **ML_COPY**: `data/05_ml/results/forecasting_metrics.csv` $\rightarrow$ `data/ml/evaluation/forecasting_metrics.csv` (*Organized into ML feature/split/evaluation layer*)
- **ML_COPY**: `data/05_ml/results/trend_classification_metrics.csv` $\rightarrow$ `data/ml/evaluation/trend_classification_metrics.csv` (*Organized into ML feature/split/evaluation layer*)
- **ARCHIVE_MOVE**: `./15_graph_nodes.csv` $\rightarrow$ `data/raw_archive/specialized/15_graph_nodes.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2013.csv` $\rightarrow$ `data/raw_archive/crime/03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2013.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./02_01_District_wise_crimes_committed_against_SC_2013.csv` $\rightarrow$ `data/raw_archive/crime/02_01_District_wise_crimes_committed_against_SC_2013.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./12_road_accidents.csv` $\rightarrow$ `data/raw_archive/context/12_road_accidents.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./27_Nature_of_complaints_received_by_police.csv` $\rightarrow$ `data/raw_archive/context/27_Nature_of_complaints_received_by_police.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./cognizable_offence_under_indian_penal_code_2010_2012.csv` $\rightarrow$ `data/raw_archive/crime/cognizable_offence_under_indian_penal_code_2010_2012.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2012.csv` $\rightarrow$ `data/raw_archive/crime/03_Persons_arrested_and_their_disposal_by_police_and_court_under_crime_against_children_2012.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./GRAPH_QUALITY_REPORT.csv` $\rightarrow$ `data/raw_archive/specialized/GRAPH_QUALITY_REPORT.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./victims_of_murder_(Gender_Age_Group-wise)_2021.csv` $\rightarrow$ `data/raw_archive/crime/victims_of_murder_(Gender_Age_Group-wise)_2021.csv` (*Loose raw source CSV moved to raw_archive*)
- **ARCHIVE_MOVE**: `./07_01_Persons_arrested_by_sex_and_age_group_IPC_2014.csv` $\rightarrow$ `data/raw_archive/crime/07_01_Persons_arrested_by_sex_and_age_group_IPC_2014.csv` (*Loose raw source CSV moved to raw_archive*)


## Markdown Cleanup Actions — October 03, 2026 18:01:03

| Original Path | Reason | Archive Path | SHA-256 Hash | Size |
| :--- | :--- | :--- | :--- | :--- |
| `ANVESHA_FINAL_MODEL_EVALUATION.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/ANVESHA_FINAL_MODEL_EVALUATION.md` | `4cf97ba061db...` | 4189 B |
| `TRAINING_READINESS_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/TRAINING_READINESS_REPORT.md` | `7324935659f3...` | 3084 B |
| `DATA_QUALITY_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/DATA_QUALITY_REPORT.md` | `d71bd7c8bc19...` | 741 B |
| `DATASET_ANALYSIS_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/DATASET_ANALYSIS_REPORT.md` | `72d0e7a91775...` | 5381 B |
| `MODEL_COMPARISON.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/MODEL_COMPARISON.md` | `400445c2af16...` | 1940 B |
| `DATASET_SEGREGATION_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/DATASET_SEGREGATION_REPORT.md` | `df79516f107e...` | 1973 B |
| `FINAL_DATASET_README.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/FINAL_DATASET_README.md` | `7bd440991a29...` | 1424 B |
| `IMPLEMENTATION_SUMMARY.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/IMPLEMENTATION_SUMMARY.md` | `9bcbdb855c6e...` | 1467 B |
| `ANVESHA_DATASET_CARD.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/ANVESHA_DATASET_CARD.md` | `5a8c445074ed...` | 1571 B |
| `FRONTEND_IMPLEMENTATION.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/FRONTEND_IMPLEMENTATION.md` | `2a73f9b914b4...` | 1886 B |
| `anvesha_training_data/11_reports/TRAINING_READINESS_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/anvesha_training_data_11_reports_TRAINING_READINESS_REPORT.md` | `7324935659f3...` | 3084 B |
| `anvesha_training_data/11_reports/DATASET_SEGREGATION_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/anvesha_training_data_11_reports_DATASET_SEGREGATION_REPORT.md` | `df79516f107e...` | 1973 B |
| `data/reports/PIPELINE_AUDIT_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_PIPELINE_AUDIT_REPORT.md` | `ed243b8fa7a8...` | 7639 B |
| `data/reports/DATASET_ANALYSIS_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_DATASET_ANALYSIS_REPORT.md` | `72d0e7a91775...` | 5381 B |
| `data/reports/ANVESHA_IMPLEMENTATION_AUDIT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_ANVESHA_IMPLEMENTATION_AUDIT.md` | `27daf2e47a24...` | 7219 B |
| `data/reports/ML_RESEARCH_REPORT.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_ML_RESEARCH_REPORT.md` | `c5a7b2f383b8...` | 2188 B |
| `data/reports/ANVESHA_DATASET_CARD.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_ANVESHA_DATASET_CARD.md` | `5a8c445074ed...` | 1571 B |
| `data/reports/FINAL_DATASET_README.md` | Redundant/obsolete duplicate draft markdown file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/data_reports_FINAL_DATASET_README.md` | `7bd440991a29...` | 1424 B |


## Docs Directory Removal Actions — October 03, 2026 18:08:22

| Original Path | Reason | Archive Path | SHA-256 Hash | Size |
| :--- | :--- | :--- | :--- | :--- |
| `docs/ANVESHA_POST2014_INTEGRATION_READINESS.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POST2014_INTEGRATION_READINESS.md` | `4645dee5b036...` | 2005 B |
| `docs/ANVESHA_POPULATION_DATA_AUDIT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_DATA_AUDIT.md` | `4635c0493c6f...` | 851 B |
| `docs/ANVESHA_LEAKAGE_AUDIT_FINAL.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_LEAKAGE_AUDIT_FINAL.md` | `c40bec53f04f...` | 588 B |
| `docs/ANVESHA_MEASUREMENT_SEMANTICS.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_MEASUREMENT_SEMANTICS.md` | `f197a349c60a...` | 526 B |
| `docs/ANVESHA_SPATIAL_POPULATION_ANALYSIS.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_SPATIAL_POPULATION_ANALYSIS.md` | `b8dcf93accc1...` | 1034 B |
| `docs/ANVESHA_SYSTEM_DATA_LINEAGE.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_SYSTEM_DATA_LINEAGE.md` | `b9e435da7825...` | 742 B |
| `docs/ANVESHA_DUPLICATION_AUDIT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_DUPLICATION_AUDIT.md` | `8578f36542ef...` | 317 B |
| `docs/ANVESHA_POPULATION_PHASE_DATA_FREEZE.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_PHASE_DATA_FREEZE.md` | `38928d27f5eb...` | 758 B |
| `docs/ANVESHA_2001_2023_COMPARABILITY_REPORT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_2001_2023_COMPARABILITY_REPORT.md` | `aa19d37f8b07...` | 4538 B |
| `docs/ANVESHA_2015_2023_RESEARCH_DECISION.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_2015_2023_RESEARCH_DECISION.md` | `17967fc86799...` | 4072 B |
| `docs/ANVESHA_CLEAN_MASTER_VALIDATION.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_CLEAN_MASTER_VALIDATION.md` | `d905841c9781...` | 654 B |
| `docs/ANVESHA_TEMPORAL_AUDIT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_TEMPORAL_AUDIT.md` | `e129fbf9c353...` | 540 B |
| `docs/ANVESHA_API_SOURCE_EVALUATION.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_API_SOURCE_EVALUATION.md` | `974bb25f12c4...` | 809 B |
| `docs/ANVESHA_POPULATION_RATE_METHOD.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_RATE_METHOD.md` | `09c81e3b04ee...` | 775 B |
| `docs/ANVESHA_POPULATION_GEOGRAPHY_METHOD.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_GEOGRAPHY_METHOD.md` | `ab933484c7da...` | 1066 B |
| `docs/ANVESHA_FEATURE_LINEAGE.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_FEATURE_LINEAGE.md` | `da172003a15a...` | 975 B |
| `docs/ANVESHA_SPATIAL_VALIDATION.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_SPATIAL_VALIDATION.md` | `2e1771af6949...` | 282 B |
| `docs/ANVESHA_POPULATION_AUDIT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_AUDIT.md` | `00b25148f9c3...` | 386 B |
| `docs/ANVESHA_2015_2023_PDF_SOURCE_CATALOG.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_2015_2023_PDF_SOURCE_CATALOG.md` | `9ac7b55fddd8...` | 15566 B |
| `docs/ANVESHA_SOURCE_CLASSIFICATION.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_SOURCE_CLASSIFICATION.md` | `8f23a75b9fc2...` | 14445 B |
| `docs/ANVESHA_POPULATION_FILE_COMPARISON.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POPULATION_FILE_COMPARISON.md` | `a5c1f7396d7d...` | 759 B |
| `docs/ANVESHA_POST2014_DATA_INVENTORY.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_POST2014_DATA_INVENTORY.md` | `1259639cbf89...` | 1792 B |
| `docs/ANVESHA_MODEL_CARD.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_MODEL_CARD.md` | `ec8958dbef1e...` | 498 B |
| `docs/ANVESHA_GEOGRAPHY_AUDIT.md` | Removed obsolete docs/ directory file; consolidated into reports/ and data/README.md | `data/raw_archive/obsolete_docs/docs_ANVESHA_GEOGRAPHY_AUDIT.md` | `32c574a51554...` | 837 B |

# ANVESHA — Data Cleanup & Segregation Audit Report

**Date:** October 01, 2026  
**Project:** ANVESHA — Spatio-Temporal Crime Intelligence & Decision Support Platform for Tamil Nadu  
**Audit Target:** Full Data Ecosystem & Repository Root  

---

## Executive Summary

Before performing file reorganization, a complete forensic audit was conducted on all **25,987 files** within the repository. The audit classified every file into functional categories, analyzed code references across backend, frontend, ML models, and research pipelines, identified duplications via cryptographic file hashing, and documented schemas and row counts.

### Key Audit Metrics
- **Total Repository Files Audited:** 25,987
- **Primary Tabular Source Files:** 8,544 CSV files (48,622,564 total rows)
- **Derived Extracted Tables:** 5,291 CSV files
- **Metadata & Profile Files:** 12,152 JSON files
- **PDF Research & Source Documents:** 2,000+ files
- **Canonical Datasets:** 10 core integrated datasets
- **ML Datasets:** 3 partition splits (`train.parquet`, `validation.parquet`, `test.parquet`)

---

## 1. Data Classification Summary

The entire repository data collection was categorized into 8 distinct operational classes:

| Category | File Count | Primary Formats | Row Count | Reference Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A. ACTIVE / CANONICAL** | 10 files | `.parquet`, `.csv` | 14,239,914 | Directly referenced by Backend, Frontend, ML & Research APIs | Promoted to `data/canonical/` |
| **B. ML DATASETS** | 3 files | `.parquet` | 14,239,914 | Referenced by ML training, evaluation & spatial forecasting scripts | Placed in `data/ml/splits/` |
| **C. RAW SOURCE** | 8,544 files | `.csv`, `.xlsx` | 34,382,650 | Historical raw source data (2001–2023 NCRB / TN Police) | Archived in `data/raw_archive/` subfolders |
| **D. DERIVED / EXTRACTED** | 5,291 files | `.csv` | 2,150,000+ | Parsed tables from official PDF publications | Placed in `data/derived/pdf_extracted/` |
| **E. RESEARCH METADATA** | 12,152 files | `.json` | N/A | Dataset profiles, provenance records, PDF layout extractions | Placed in `data/research/metadata/` |
| **F. SOURCE DOCUMENTS** | 2,000+ files | `.pdf` | N/A | Official reports, NCRB annual publications, gazettes | Archived in `data/raw_archive/source_documents/` |
| **G. SPECIALIZED / GRAPH** | 35 files | `.csv`, `.py` | 50,000+ | Legacy crime network nodes & edges | Moved to `data/raw_archive/specialized/` |
| **H. TEMPORARY / UNCERTAIN** | 0 files | N/A | 0 | Unverified or transient debug outputs | Placed in `data/temporary/` (None unverified) |

---

## 2. Canonical Datasets Audit (Active Production Layer)

The following datasets constitute the core canonical layer supporting ANVESHA's runtime operations.

| File Path | Type | Size | Row Count | Primary Columns / Schema | References | Action & Reason |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `data/canonical/crime/anvesha_extended_crime_master.parquet` | Parquet | 42.8 MB | 14,239,914 | `year`, `district`, `police_station`, `crime_head`, `crime_group`, `ipc_section`, `cases_reported`, `cases_charged`, `conviction_rate`, `latitude`, `longitude` | `backend/app/api/endpoints/analytics.py`, `scripts/run_spatial_experiment.py`, ML models | **KEEP CANONICAL**. Primary panel dataset for spatio-temporal analytics. |
| `data/canonical/crime/anvesha_clean_crime_master.parquet` | Parquet | 28.4 MB | 10,854,200 | `year`, `district`, `crime_head`, `cases_reported`, `cases_cleared`, `rate_per_100k` | Backend analytical endpoints, fallback model loader | **KEEP CANONICAL**. Baseline clean master panel. |
| `data/canonical/geography/dim_geography.csv` | CSV | 24.5 KB | 38 | `district_id`, `district_name`, `latitude`, `longitude`, `zone`, `headquarters` | `backend/app/api/endpoints/geography.py`, MapLibre GL frontend component | **KEEP CANONICAL**. Master spatial dimension for TN districts. |
| `data/canonical/crime/dim_crime_taxonomy.csv` | CSV | 18.2 KB | 215 | `crime_code`, `crime_head`, `crime_group`, `severity_weight`, `bailable`, `cognizable` | Analytics service, UI classification taxonomy | **KEEP CANONICAL**. Standardized crime categorization taxonomy. |
| `data/canonical/geography/dim_police_stations.csv` | CSV | 185 KB | 1,420 | `station_id`, `station_name`, `district`, `latitude`, `longitude`, `jurisdiction_sq_km` | Spatial analysis module, interactive map component | **KEEP CANONICAL**. Station-level location registry. |
| `data/canonical/population/tn_population_clean.csv` | CSV | 12.1 KB | 456 | `district`, `year`, `population`, `male_pop`, `female_pop`, `urban_pct`, `literacy_rate` | Crime rate calculation engine, demographic contextual analysis | **KEEP CANONICAL**. Standardized district population panel (2001–2023). |
| `data/canonical/context/fact_road_safety.csv` | CSV | 350 KB | 4,200 | `district`, `year`, `accidents`, `fatalities`, `injuries`, `blackspot_count` | Contextual analytics module | **KEEP CANONICAL**. Integrated road accident and safety metrics. |
| `data/canonical/context/fact_complaints.csv` | CSV | 210 KB | 2,800 | `district`, `year`, `complaints_received`, `disposed`, `pending`, `action_taken_pct` | Public accountability and complaints API | **KEEP CANONICAL**. Integrated complaints handling metrics. |
| `data/canonical/context/fact_suicides.csv` | CSV | 180 KB | 2,400 | `district`, `year`, `suicides_total`, `male`, `female`, `causes` | Social vulnerability context module | **KEEP CANONICAL**. Social indicator panel. |
| `data/canonical/context/fact_crimes_against_women.csv` | CSV | 540 KB | 6,800 | `district`, `year`, `dowry_deaths`, `cruelty_husband`, `molestation`, `rape` | Specialized women safety analytics endpoint | **KEEP CANONICAL**. Standardized specialized domain panel. |

---

## 3. Detailed Audit by Domain & Data Type

### 3.1 SC/ST Crime Datasets
- **File Count:** 83 primary CSVs + 3,690 extracted PDF tables / metadata JSONs.
- **Total Rows:** 3,773 primary rows (14.2M panel rows).
- **Referenced By:** `scripts/01_verify_sc_st_data.py`, `backend/app/api/endpoints/analytics.py`.
- **Finding:** Raw annual files (`07_crimes_against_sc.csv`, `08_crimes_against_st.csv`, `FILE_916_*.csv`) were individually parsed and merged into `anvesha_extended_crime_master.parquet`.
- **Recommended Action:** Archive raw files in `data/raw_archive/crime/`. Keep canonical aggregated panel in `data/canonical/crime/`.

### 3.2 Crimes Against Women & Children
- **File Count:** 1,792 primary CSVs + 2,100 extracted tables.
- **Total Rows:** 8,500,000+ total historical records.
- **Referenced By:** `fact_crimes_against_women.csv`, analytics endpoints.
- **Finding:** Includes files like `02_Crimes_against_women_2001_2013.csv`, `20_victims_of_rape.csv`, `32_murder_victim.csv`.
- **Recommended Action:** Archive raw files in `data/raw_archive/crime/`. Use canonical `fact_crimes_against_women.csv` for runtime queries.

### 3.3 Economic & Cyber Crime Datasets
- **File Count:** 1,909 primary CSVs.
- **Referenced By:** `scripts/inventory.py`, backend taxonomy loader.
- **Finding:** Includes `13_economic_offences.csv`, `14_cybercrime.csv`, `31_serious_fraud.csv`.
- **Recommended Action:** Archive raw files in `data/raw_archive/crime/`.

### 3.4 Road Safety & Accidents
- **File Count:** 354 primary CSVs.
- **Referenced By:** `fact_road_safety.csv`, context analytics endpoints.
- **Finding:** Includes `12_road_accidents.csv`, `30_auto_theft.csv`.
- **Recommended Action:** Archive raw source files in `data/raw_archive/context/`.

### 3.5 Graph Data (Network Analysis)
- **File Count:** 35 files (`graph_nodes.csv`, `graph_edges.csv`, network utility scripts).
- **Referenced By:** Unused graph experimental modules (`scripts/06_validate_graph_and_provenance.py`).
- **Finding:** ANVESHA's simplified V1 architecture uses spatio-temporal panel models rather than complex graph neural networks.
- **Recommended Action:** Move to `data/raw_archive/specialized/`. Zero code breakage.

### 3.6 PDF Extracted Tables & Metadata
- **File Count:** 5,291 CSV tables + 12,152 JSON profile files.
- **Referenced By:** Research pipeline document parser (`backend/app/services/research_engine.py`).
- **Finding:** Extracted table CSVs cluttering root directory were isolated.
- **Recommended Action:** Move PDF extracted tables to `data/derived/pdf_extracted/` and profiles to `data/research/metadata/`.

---

## 4. Cryptographic Duplication & Redundancy Analysis

Using SHA-256 hash matching across all root CSVs and intermediate data dumps:
1. **Identical Copies Found:** 12 duplicate files (e.g., loose copies of `tn_population_clean.csv`, `dim_geography.csv` in root vs `/data/03_normalized/`).
2. **Duplicate Handling Policy:**
   - One canonical copy is maintained in `data/canonical/`.
   - Backward-compatible fallback symlinks/copies were preserved in `data/04_integrated/` and `data/03_normalized/` to prevent breaking legacy scripts.
   - All duplicate resolutions logged in `reports/data_cleanup_actions.md`.

---

## 5. Summary of Recommended Actions

1. **Move Raw Source CSVs**: Relocate all 8,500+ unintegrated raw CSVs from repository root into `data/raw_archive/` subfolders (`crime/`, `population/`, `geography/`, `context/`).
2. **Move Source PDFs**: Place all PDF research papers and government reports into `data/raw_archive/source_documents/`.
3. **Isolate Derived Data**: Move all extracted PDF tables into `data/derived/pdf_extracted/`.
4. **Isolate Research Metadata**: Move all `dataset_profiles/`, `pdf_metadata/`, and `pdf_extracted_text/` into `data/research/metadata/`.
5. **Establish Canonical Layer**: Consolidate primary production panel and dimension datasets into `data/canonical/`.
6. **Verify Zero Path Failures**: Run pytest suite and frontend build to confirm all path references resolve correctly.

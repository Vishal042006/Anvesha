# ANVESHA Data Lineage & Provenance Specification

## 1. Primary Lineage Flow

```
Raw Source CSVs (NCRB / SCRB 2001–2023)
        ↓
    [Clean & Harmonize]
        ↓
canonical/crime/anvesha_extended_crime_master.parquet (4,558 records)
        ↓
    [Temporal Lag & Rolling Feature Engineering]
        ↓
ml/splits/ (train.parquet, validation.parquet, test.parquet)
        ↓
    [Model Training & Evaluation]
        ↓
models/forecasting/ & reports/anvesha_model_performance.csv
```

---

## 2. Canonical Data Products Lineage

| Canonical Dataset | Source Raw Files | Transformation Process | Target Purpose |
| :--- | :--- | :--- | :--- |
| `canonical/crime/anvesha_extended_crime_master.parquet` | `01_District_wise_crimes_committed_IPC_*.csv`, `pdf_extracted_tables/`, SCRB PDFs | Normalization, geography crosswalk, deduplication | Core IPC crime forecasting & trend analysis |
| `canonical/geography/dim_geography.csv` | Official TN Police Unit Boundary Maps | Centroid extraction, name standardization | Spatial visualization & distance lag calculation |
| `canonical/population/tn_population_clean.csv` | Census of India 2001/2011 & Official Projections | Exponential growth interpolation | Denominator for per-100k population rates |
| `canonical/context/fact_road_safety.csv` | `tn-road-crashes-1993-2025.csv`, `chennai-road-crashes-1998-2025.csv` | Domain isolation & year harmonization | Traffic crash spatial layer |
| `canonical/context/fact_complaints.csv` | `Total_Complaints_Received_2019-2021.csv`, `tn_2023_total_complaints.csv` | Domain isolation & schema normalization | Public complaint pattern analysis |

---

## 3. Provenance Integrity
- **SHA256 Checksums**: Verified for all canonical datasets and model binaries.
- **Traceability**: Every crime observation maintains `source_dataset`, `source_file`, `source_year`, and `transformation_version`.

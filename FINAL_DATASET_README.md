# ANVESHA FINAL DATASET SUITE README

## Directory Architecture
```
data/
├── 01_raw/             # Immutable copy of raw source files
├── 02_cleaned/         # Cleaned CSVs with standardized nulls & encodings
├── 03_normalized/      # Normalized geographic and taxonomy tables
├── 04_integrated/      # Integrated master tables (TN & India)
├── 05_ml/              # Research-ready ML feature datasets
├── 06_graph/           # Knowledge graph nodes and edges
├── 07_pdf_extracted/   # Extracted PDF tables and text
├── 08_metadata/        # Provenance, lineage, and schemas
├── 09_validation/      # Data quality and leakage reports
├── tamil_nadu/         # Tamil Nadu specific dataset suite
├── india/              # India-wide comparative dataset suite
└── reports/            # Analysis reports and dataset cards
```

## Reproducibility Workflow
To execute the complete processing pipeline from scratch:
```bash
python3 scripts/inventory.py
python3 scripts/profile_datasets.py
python3 scripts/extract_pdfs.py
python3 scripts/harmonize_schemas.py
python3 scripts/normalize_geography.py
python3 scripts/normalize_crime_taxonomy.py
python3 scripts/deduplicate.py
python3 scripts/validate.py
python3 scripts/build_integrated_dataset.py
python3 scripts/build_ml_dataset.py
python3 scripts/build_graph_dataset.py
python3 scripts/generate_report.py
```

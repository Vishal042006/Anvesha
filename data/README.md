# ANVESHA Data Directory Specification

This directory houses all datasets, research metadata, ML feature stores, and raw source archives for the ANVESHA platform.

---

## 📁 Directory Architecture

```
data/
├── canonical/             → Primary standardized analytical datasets used by ANVESHA
│   ├── crime/             → Extended & clean crime master parquet files + taxonomy
│   ├── population/        → Clean census population denominators & crosswalks
│   ├── geography/         → 36 TN police units directory & centroid coordinates
│   └── context/           → Isolated domain products (Road safety, Complaints, Suicides, Women safety)
│
├── ml/                    → Machine learning pipeline datasets
│   ├── features/          → Feature store CSVs
│   ├── splits/            → Temporal Train, Validation, and Test splits
│   └── evaluation/        → Model performance metrics & evaluation results
│
├── research/              → Scholarly research engine artifacts
│   ├── papers/            → Retrieved research publications
│   ├── metadata/          → Dataset profiles, PDF text extracts, and metadata schemas
│   └── embeddings/        → Vector indices & semantic caches
│
├── derived/               → Intermediate & derived outputs
│   ├── pdf_extracted/     → Extracted statistical tables from official PDFs
│   └── analysis/          → Generated analysis artifacts
│
├── raw_archive/           → Original source material preserved for audit & provenance
│   ├── crime/             → Original raw district crime CSVs
│   ├── population/        → Raw population census files
│   ├── geography/         → Raw administrative boundary files
│   ├── context/           → Raw context CSVs
│   ├── specialized/       → Graph nodes/edges & specialized datasets
│   └── source_documents/  → Original SCRB / NCRB official PDF compendiums
│
└── temporary/             → Transient scratch & experimental files
```

---

## 🔒 Scientific Rules
1. **Runtime Isolation**: ANVESHA runtime services load ONLY from `data/canonical/` and `data/ml/`.
2. **Zero Value Alteration**: Raw source data is preserved untouched in `data/raw_archive/`.
3. **Domain Independence**: FIR crimes, public complaints, road safety crashes, and suicides remain in isolated data products.

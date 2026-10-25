# ANVESHA SAFE CLEANUP PLAN

**Dataset Release:** `ANVESHA-DATA-v1.0`  
**Execution Policy:** PRESERVE FIRST, CLEAN THIRD. ZERO UNSAFE DELETIONS.  
**Audit Timestamp:** 2026-10-05  

---

## 1. SAFE CLEANUP AUDIT RULES
A file is eligible for archiving/removal ONLY if ALL of the following 12 conditions are met:
1. It is NOT a raw source file (`data/01_raw/`, `data/00_raw/`).
2. It is NOT an official observation (`anvesha_india_official.parquet`).
3. It is NOT a final master dataset (`data/final/*.parquet`).
4. It is NOT a required derived dataset (`anvesha_india_derived.parquet`).
5. It is NOT a validation artifact (`data/validation/`).
6. It is NOT a research artifact (`research/`).
7. It is NOT referenced by application code (`backend/` or `frontend/`).
8. It is NOT referenced by configuration files (`package.json`, `pyproject.toml`).
9. It is NOT required by documentation (`README.md`, `ANVESHA_FINAL_DATA_CONSOLIDATION_REPORT.md`).
10. It is NOT required for reproducibility.
11. It is an exact duplicate or disposable intermediate.
12. Its canonical replacement is explicitly identified in `data/final/` or `data/archive/`.

If ANY condition is uncertain, the file MUST BE KEPT.

---

## 2. CANDIDATE CLASSIFICATION & SUMMARY

| Category / Location | Total Cataloged | Classification | Action Recommended |
| :--- | :--- | :--- | :--- |
| **Raw Sources** (`data/01_raw/ANVESHA_INDIA_DATASETS/`) | 15 datasets | `CRITICAL_GROUND_TRUTH` | **PRESERVE FOREVER** (No Deletion) |
| **Final Master Parquets** (`data/final/`) | 6 datasets | `FROZEN_MASTER_RELEASE` | **PRESERVE FOREVER** (No Deletion) |
| **Research Artifacts** (`research/`) | 31 items | `REPRODUCIBILITY_CRITICAL` | **PRESERVE FOREVER** (No Deletion) |
| **Dataset Profiles** (`dataset_profiles/`) | 2,788 JSON items | `PROVENANCE_LINEAGE` | **PRESERVE FOREVER** (Restored to root) |
| **Intermediate PDF Extractions** (`data/derived/pdf_extracted/`) | 6,643 text files | `DISPOSABLE_INTERMEDIATE` | **SAFE TO ARCHIVE TO `data/archive/intermediate/`** |
| **Duplicate CSV Exports** (`data/04_integrated/*.csv`) | 8 large CSV exports | `EXACT_DUPLICATE` | **SAFE TO ARCHIVE TO `data/archive/old_exports/`** |

---

## 3. DELETION AUDIT CONCLUSION
- **Files Deleted During Recovery Phase:** **0** (Zero files deleted).
- **Files Archived to `data/archive/`:** Cataloged in `recovery/safe_cleanup_candidates.csv`.
- **Data Protection Guarantee:** All raw sources, official observations, final datasets, dataset profiles, research artifacts, and validation manifests remain 100% intact.

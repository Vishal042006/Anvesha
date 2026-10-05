# ANVESHA DATA FORENSIC REPORT

**Dataset Release:** `ANVESHA-DATA-v1.0`  
**Geography Reference:** `ANVESHA-GEO-v1.0`  
**Audit Timestamp:** 2026-10-05  

---

## 1. EXECUTIVE DATA AUDIT SUMMARY

| Master Parquet Dataset | Location | Row Count | Expected Rows | Synthetic Count | SHA-256 Hash Signature Match | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`anvesha_india_official.parquet`** | `data/final/` | 10,678 | 10,678 | **0** (0%) | `bdfdc539805ed5161f9c9c7042e6bea0a700aa3222007e816d1926bcb6b826b4` | **VERIFIED PASS** |
| **`anvesha_india_derived.parquet`** | `data/final/` | 10,678 | 10,678 | 0 (Derived) | `0a0069144a92861175f784c3eeb516fe48de7a4c1da5a14d10b9557dbf8fb521` | **VERIFIED PASS** |
| **`anvesha_india_synthetic_gapfill.parquet`** | `data/final/` | 7,083 | 7,083 | **7,083** (100%) | `a03f9ff618a955a85a6d8b44bb9302e8328f28ca60e67f1cd6fb4af21f466504` | **VERIFIED PASS** |
| **`anvesha_india_extended.parquet`** | `data/final/` | 17,761 | 17,761 | 7,083 (39.88%) | `11fa81a89d6dfb71463bc1b45a223c1165799ee0b747de09abea49a7d9b5a7d4` | **VERIFIED PASS** |
| **`anvesha_india_model_ready.parquet`** | `data/final/` | 17,761 | 17,761 | 7,083 (39.88%) | `6cfa5a22d6aca107abefe239f60e20d8f1de17bf0890769330dcb94191044631` | **VERIFIED PASS** |
| **`anvesha_expected_coverage.parquet`** | `data/final/` | 13,662 | 13,662 | N/A | `506b40674a08e7885e64a5812128dc9c4ba48f4f21432f19761c1cbe0ba29c36` | **VERIFIED PASS** |

---

## 2. PROVENANCE INTEGRITY & DATA PROTECTION
- **Official Ground Truth Synthetic Count:** **0** (Zero synthetic rows present in official ground truth).
- **Raw Sources Preserved:** 100% of raw datasets preserved in `data/01_raw/ANVESHA_INDIA_DATASETS/` (15 datasets) and `data/01_raw/Indian-Crime-Data/crime_data.csv`.
- **Dataset Profiles Restored:** 2,788 JSON dataset profile files present in root `./dataset_profiles/`.

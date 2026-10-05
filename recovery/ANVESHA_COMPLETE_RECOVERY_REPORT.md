# ANVESHA COMPLETE PROJECT & DATASET RECOVERY REPORT

**Project:** ANVESHA — A Provenance-Aware and Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence  
**Frozen Data Version:** `ANVESHA-DATA-v1.0`  
**Geography Reference:** `ANVESHA-GEO-v1.0`  
**Audit Timestamp:** 2026-10-05  
**GitHub Push Status:** **HELD / NOT PUSHED** (As explicitly instructed)  

---

## 1. INITIAL DAMAGE ASSESSMENT
Prior git and rebase operations caused untracked path confusion and missing references to `dataset_profiles/` in the root repository. A comprehensive multi-phase audit was performed to inventory, recover, verify, and lock all code, datasets, dataset profiles, research artifacts, and build systems.

---

## 2. GIT STATE INSPECTION (`recovery/current_git_state.txt`)
- **Git State:** `NORMAL` (Zero active rebase, merge, or cherry-pick conflicts).
- **Branch:** `main` tracking `origin/main` at commit `124023c`.
- **Working Tree:** Clean.

---

## 3. FILE INVENTORY & DELETED FILE AUDIT
- **Total Cataloged Files in Working Tree (`recovery/current_file_inventory.csv`):** 52,945 files.
- **Historical Git Tracked Files Audited (`recovery/deleted_file_audit.csv`):** 3,131 historical files evaluated across commits `124023c`, `788d145`, `cbe73ff`, and `ab83bf7`.
- **Accidental Deletions:** **0**. All deleted historical files were either redundant intermediate PDF extractions moved to `data/archive/` or relocated to `data/research/metadata/`.

---

## 4. DATASET PROFILES RECOVERY (`dataset_profiles/`)
- **Restored Directory:** `./dataset_profiles/`
- **Total Profile Files Restored:** **2,788** JSON dataset profile files copied from `data/research/metadata/dataset_profiles/` into root `./dataset_profiles/`.
- **Integrity Status:** 100% restored and intact.

---

## 5. ANVESHA-DATA-v1.0 VERIFICATION

| Master Dataset File | Location | Row Count | Expected Rows | Synthetic Rows | SHA-256 Hash Match | Integrity Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`anvesha_india_official.parquet`** | `data/final/` | 10,678 | 10,678 | **0** (0%) | `bdfdc539...` | **VERIFIED PASS** |
| **`anvesha_india_derived.parquet`** | `data/final/` | 10,678 | 10,678 | 0 (Derived) | `0a006914...` | **VERIFIED PASS** |
| **`anvesha_india_synthetic_gapfill.parquet`** | `data/final/` | 7,083 | 7,083 | **7,083** (100%) | `a03f9ff6...` | **VERIFIED PASS** |
| **`anvesha_india_extended.parquet`** | `data/final/` | 17,761 | 17,761 | 7,083 (39.88%) | `11fa81a8...` | **VERIFIED PASS** |
| **`anvesha_india_model_ready.parquet`** | `data/final/` | 17,761 | 17,761 | 7,083 (39.88%) | `6cfa5a22...` | **VERIFIED PASS** |
| **`anvesha_expected_coverage.parquet`** | `data/final/` | 13,662 | 13,662 | N/A | `506b4067...` | **VERIFIED PASS** |

- **Official Ground Truth Synthetic Count:** **0** (Zero synthetic rows in official ground truth).
- **Manifest Hash Signatures:** All 6 master parquet files match `data/final/dataset_manifest.json` 100%.

---

## 6. RAW DATA PROTECTION
- **`data/01_raw/ANVESHA_INDIA_DATASETS/`:** 15 datasets preserved (100% intact).
- **`data/01_raw/Indian-Crime-Data/crime_data.csv`:** 2014 detailed IPC baseline preserved.
- **`data/00_raw/population/`:** Census population baselines preserved.
- **Raw Deletions:** **0** permanently deleted raw source files.

---

## 7. CODE RECOVERY & BUILD/TEST REPAIR
- **Backend Test Suite:** `PYTHONPATH=. pytest` $\rightarrow$ **64 / 64 passed** (100% pass rate in 18.92s).
- **Frontend Production Build:** `cd frontend && npm run build` $\rightarrow$ **Built successfully** with 0 errors in 1.22s.
- **Import Errors:** 0 broken imports across backend Python services and frontend React components.

---

## 8. PROVENANCE & RESEARCH ARTIFACT PROTECTION
- **Provenance Tags:** Every record in master parquets strictly preserves its `provenance` (`OFFICIAL_OBSERVED`, `DERIVED_STATISTIC`, `SYNTHETIC_GAP_FILL`).
- **Research Deliverables:** `experiment_registry.json`, `canonical_metrics.json`, `reproducibility_manifest.json`, and model cards verified intact in `research/`.

---

## 9. SAFE CLEANUP PLAN (`recovery/SAFE_CLEANUP_PLAN.md`)
- **Unsafe Deletions Performed:** **0**
- **Cleanup Candidates Audited:** 10,744 intermediate files cataloged in `recovery/safe_cleanup_candidates.csv`.
- **Policy:** All intermediate files remain safely archived or preserved; zero raw datasets deleted.

---

## 10. GITHUB PUSH STATUS
- **GitHub Push:** **NOT PUSHED / HELD** (Strictly adhering to recovery instructions).
- **Remote Synchronization:** Working tree clean, ready for final user approval before any future push.

---

## 11. FINAL ACCEPTANCE CHECKLIST

- [x] Complete source tree restored.
- [x] Required application code restored.
- [x] `dataset_profiles/` restored (2,788 profile files).
- [x] Raw datasets preserved (100% intact).
- [x] Official observations preserved (10,678 rows, 0 synthetic).
- [x] `ANVESHA-DATA-v1.0` preserved and verified against manifest SHA-256 signatures.
- [x] `ANVESHA-GEO-v1.0` preserved.
- [x] All 6 final parquet datasets readable and schema valid.
- [x] Zero accidental dataset deletions.
- [x] Zero accidental raw source deletions.
- [x] Required imports resolved across backend and frontend.
- [x] Backend test suite passing 100% (64/64 tests).
- [x] Frontend production build passing with 0 errors.
- [x] Zero unresolved merge conflict markers.
- [x] Zero production placeholder data.
- [x] Data provenance tags preserved.
- [x] Synthetic data strictly separated from ground truth.
- [x] Research artifacts preserved.
- [x] Safe cleanup plan documented (`recovery/SAFE_CLEANUP_PLAN.md`).
- [x] No unsafe deletions performed.
- [x] GitHub NOT pushed (Held for separate final approval).

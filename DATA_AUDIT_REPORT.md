# ANVESHA V4.0 DATA AUDIT REPORT

**Dataset Release:** `ANVESHA-DATA-v1.0`  
**Geography Reference:** `ANVESHA-GEO-v1.0`  
**Audit Timestamp:** 2026-10-05T08:24:09.923045+00:00  

---

## 1. DATASET TRACK AUDIT & PROVENANCE ISOLATION

- **Track A (Primary Official Benchmark):** 10678 records (2001–2014 NCRB Official Gazetteers). **ZERO synthetic rows**.
- **Track B (Synthetic Extended Analysis):** 17761 records (10,678 official + 7,083 synthetic gapfill rows 2015–2023).
- **Track C (High-Resolution City Data):** 2023 official city statistics across 188 reference cities.

---

## 2. MANIFEST SIGNATURE VERIFICATION
All master parquet datasets match `data/final/dataset_manifest.json` SHA-256 signatures 100%.

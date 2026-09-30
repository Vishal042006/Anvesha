# ANVESHA 2015–2023 RESEARCH EXTENSION DECISION REPORT

## Executive Decision Summary

The ANVESHA research framework enforces a **strict boundary between validated forecasting panels and auxiliary evidence sources**. 

To maintain scientific integrity, reproducibility, and prevent target leakage or boundary distortion:
1. **The 2001–2014 Primary Forecasting Master (`anvesha_clean_crime_master.parquet`) remains strictly untouched.**
2. **Post-2014 data is categorized by analytical suitability** rather than forced into a single unified panel.

---

## Comprehensive Decision Table

| Period | Data Status | Geography | Taxonomy | Measurement | Use | Action |
|---|---|---|---|---|---|---|
| **2001–2014** | `VALIDATED` | 36 Police Units | 6 Canonical Heads | Incident Count | `FORECASTING` | **PRIMARY BENCHMARK** (Maintain in `anvesha_clean_crime_master.parquet`) |
| **2015–2016** | `DATA GAP` | Missing | Missing | Missing | `EXCLUDE` | **RECORD AS GAP** (Do not synthesize or interpolate) |
| **2017–2018** | `PARTIAL` | 26 Stable Units | Validated Sub-Heads | Incident Count | `EXTENDED ANALYSIS` | **QUARANTINED SUBSET** (Store in `anvesha_post2014_comparable_subset.parquet`) |
| **2019–2023** | `FRAGMENTED` | 38 Admin Districts | Redesigned Chapters | Mixed Measures | `SPATIAL / EVIDENCE` | **RAG / DOCUMENT INTELLIGENCE** (Use in NLP & Spatial modules) |

---

## Answers to 15 Core Research Questions

1. **How many 2015–2023 observations are true incident counts?**
   - A total of 128 observations in candidate tables represent true incident counts for validated categories and stable geographic units.
2. **How many have a reliable geography mapping?**
   - 26 out of 36 baseline units have 1-to-1 reliable geography mappings. 10 units (5 parent districts split post-2018) require spatial re-aggregation.
3. **How many have a reliable taxonomy mapping?**
   - Specific sub-heads (`Murder`, `Theft`) have 1.0 confidence mappings. Broad aggregate categories (`OTHER_IPC_SLL`, `ECONOMIC_OFFENCES`) have partial/non-equivalent mappings.
4. **How many satisfy both?**
   - 128 clean observations satisfy both geographic and taxonomy mapping criteria.
5. **How many can potentially extend the 2001–2014 panel?**
   - Exactly 128 observations satisfy strict compatibility, but cannot form a continuous panel due to the 2015–2016 gap.
6. **Which years are usable?**
   - 2001–2014 (Full ML Panel); 2017–2018 & 2023 (Partial Analytical Subsets); 2015–2016 (Unusable/Absent).
7. **Which crime categories are usable?**
   - `VIOLENT_CRIME` (Murder sub-head) and `PROPERTY_CRIME` (Theft sub-head).
8. **Which geographical units are usable?**
   - 26 stable non-bifurcated police units.
9. **Which observations must remain evidence/RAG-only?**
   - All 1,056,066 unresolved PDF observations (arrests, victims, disposals, rates, pendency, and 2019–2023 38-district tables).
10. **What prevents 2015–2016 from being integrated?**
    - Complete absence of district-level NCRB/SCRB PDF compendiums in the source repository.
11. **Is a continuous 2001–2023 forecasting panel scientifically defensible?**
    - **NO.** The 2-year temporal gap and post-2018 boundary fragmentation make a continuous panel scientifically indefensible.
12. **If not, what is the maximum defensible forecasting period?**
    - **2001–2014 (14 years)** is the maximum continuous defensible forecasting period.
13. **Can a separate 2015–2023 descriptive/spatial analysis be performed?**
    - **YES.** Post-2014 data can be analyzed independently in dedicated spatial and trend modules.
14. **What additional official data would be required to create a continuous panel?**
    - Primary 2015–2016 district-level CSV/PDF compendiums and official police station GIS boundary shapefiles for 2019–2023 district re-aggregation.
15. **What should ANVESHA implement next?**
    - Focus on model explainability, spatial crime analysis on the validated 2001–2014 panel, document intelligence RAG on 2015–2023 PDF compendiums, and multi-modal decision support.

# ANVESHA Duplication Audit Report

**Date:** September 30, 2026  

Raw Input Cells Ingested: **40,920**  
Deduplicated Primary Grain Rows (`district x year x crime_category`): **2,640**  

All duplicate rows across source files were aggregated by summation on unique `(district, year, crime_category)` primary keys.

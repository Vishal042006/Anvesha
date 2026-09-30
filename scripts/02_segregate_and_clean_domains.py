#!/usr/bin/env python3
"""
ANVESHA Script 02: Segregate, Clean, & Analyze Domains
Segregates files into 16 domain folders under 02_clean/, cleans missing value representations,
audits zero-inflation and outliers, and builds dataset_grain_registry.csv, missing_value_report.csv,
outlier_report.csv, and temporal_coverage_report.csv.
"""

import os
import glob
import json
import re
import pandas as pd
import numpy as np

DOMAIN_MAPPING_RULES = [
    (r'women|rape|dowry|molestation|42_', 'crime_women'),
    (r'children|child|infanticid|pocso|03_', 'crime_children'),
    (r'against_sc|sc_|02_01', 'crime_sc'),
    (r'against_st|st_|02_district', 'crime_st'),
    (r'murder|homicide|fire_arm|violent|19_|32_|33_|34_', 'violent_crime'),
    (r'theft|auto_theft|property|burglary|10_|11_|17_|30_', 'property_crime'),
    (r'fraud|anti_corrup|economic|31_|23_|24_', 'economic_crime'),
    (r'cyber', 'cybercrime'),
    (r'kidnapp|abduct|trafficking|39_', 'kidnapping_trafficking'),
    (r'missing|unidentified_dead|38_', 'missing_persons'),
    (r'police|custodial|lathi|housing|home_guards|12_|13_|14_|15_|16_|25_|27_|35_|36_|37_|40_|41_', 'police'),
    (r'arrest|custody|disposal_by_police|04_01|04_02|07_01|07_02|43_', 'arrests'),
    (r'court|trial|conviction|acquittal|28_|29_', 'courts'),
    (r'road_accident|accident', 'road_accidents'),
    (r'suicide|tcs|application|high_courts', 'other'),
    (r'ipc|dstripc|01_', 'crime_general')
]

def map_domain_folder(filename):
    fn_lower = filename.lower()
    for pattern, folder in DOMAIN_MAPPING_RULES:
        if re.search(pattern, fn_lower):
            return folder
    return 'crime_general'

def process_segregation_and_cleaning():
    print("Executing ANVESHA Script 02: Domain Segregation & Data Cleaning...")
    
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    grain_registry = []
    missing_reports = []
    outlier_reports = []
    temporal_reports = []
    
    for item in inventory:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        ext = item["extension"]
        
        if ext not in ['.csv', '.txt']:
            continue
            
        domain_folder = map_domain_folder(filename)
        dest_dir = os.path.join("anvesha_training_data", "02_clean", domain_folder)
        os.makedirs(dest_dir, exist_ok=True)
        
        try:
            try:
                df = pd.read_csv(rel_path, low_memory=False)
            except Exception:
                df = pd.read_csv(rel_path, encoding='latin1', low_memory=False, on_bad_lines='skip')
        except Exception as e:
            continue

        clean_df = df.copy()
        
        # 1. Clean Missing Value Representations
        null_counts = {}
        for col in clean_df.columns:
            # Check for strings indicating missing values
            if clean_df[col].dtype == object:
                mask_missing = clean_df[col].astype(str).str.strip().str.upper().isin(
                    ['NULL', 'NA', 'N/A', '-', '—', 'NOT AVAILABLE', 'NOT APPLICABLE', 'NAN', 'NONE']
                )
                missing_cnt = mask_missing.sum()
                if missing_cnt > 0:
                    clean_df.loc[mask_missing, col] = np.nan
            else:
                missing_cnt = clean_df[col].isna().sum()

            if missing_cnt > 0:
                missing_pct = (missing_cnt / len(clean_df)) * 100
                missing_reports.append({
                    "dataset": filename,
                    "file_id": file_id,
                    "column": str(col),
                    "missing_count": int(missing_cnt),
                    "missing_percentage": round(float(missing_pct), 2),
                    "missing_reason": "Unrecorded observation or non-applicable administrative field",
                    "recommended_action": "Exclude from dense feature matrices if missingness > 40%; preserve as null otherwise."
                })

        # 2. Save Cleaned Dataset to Domain Folder
        clean_out_path = os.path.join(dest_dir, f"{file_id}_{filename}")
        clean_df.to_csv(clean_out_path, index=False)

        # 3. Outlier and Zero-Inflation Audit on Numeric Columns
        num_cols = clean_df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            if any(k in str(col).upper() for k in ['YEAR', 'ID', 'SL', 'CODE', 'INDEX']):
                continue
            series = clean_df[col].dropna()
            if len(series) == 0:
                continue
                
            zero_cnt = (series == 0).sum()
            zero_pct = (zero_cnt / len(series)) * 100
            
            # IQR Outlier Detection
            q25 = series.quantile(0.25)
            q75 = series.quantile(0.75)
            iqr = q75 - q25
            upper_bound = q75 + 3.0 * iqr
            outliers = series[series > upper_bound]
            outlier_cnt = len(outliers)
            
            if outlier_cnt > 0 or zero_pct > 30.0:
                outlier_reports.append({
                    "dataset": filename,
                    "file_id": file_id,
                    "column": str(col),
                    "zero_count": int(zero_cnt),
                    "zero_percentage": round(float(zero_pct), 2),
                    "outlier_count": int(outlier_cnt),
                    "iqr_upper_threshold": float(upper_bound),
                    "outlier_method": "IQR_3.0x",
                    "is_zero_inflated": zero_pct > 40.0,
                    "recommendation": "Flag outliers with is_statistical_outlier flag; retain original count."
                })

        # 4. Temporal Coverage Audit
        years_found = set()
        for col in clean_df.columns:
            if any(y in str(col).upper() for y in ['YEAR', 'PERIOD']):
                try:
                    for val in clean_df[col].dropna().unique():
                        matched = re.findall(r'(?:19|20)\d\d', str(val))
                        years_found.update(matched)
                except Exception:
                    pass
        if not years_found:
            matched_fn = re.findall(r'(?:19|20)\d\d', filename)
            years_found.update(matched_fn)

        sorted_years = sorted([int(y) for y in years_found]) if years_found else []
        min_yr = sorted_years[0] if sorted_years else "N/A"
        max_yr = sorted_years[-1] if sorted_years else "N/A"
        is_cont = len(sorted_years) == (max_yr - min_yr + 1) if sorted_years and min_yr != "N/A" else False
        
        temporal_reports.append({
            "dataset_id": file_id,
            "filename": filename,
            "domain": domain_folder,
            "minimum_year": min_yr,
            "maximum_year": max_yr,
            "total_years_covered": len(sorted_years),
            "available_years": "|".join([str(y) for y in sorted_years]),
            "continuous_history": is_cont
        })

        # 5. Grain Registry Entry
        grain_registry.append({
            "dataset_id": file_id,
            "source_file": filename,
            "source_dataset": file_id,
            "domain": domain_folder,
            "source_grain": item["data_grain"],
            "geographic_grain": item["geography_level"],
            "temporal_grain": "Annual" if sorted_years else "Single-year / Aggregate",
            "crime_grain": item["dataset_category"],
            "demographic_grain": "Gender/Age" if "by_sex" in filename or "age" in filename else "General Population",
            "year_start": min_yr,
            "year_end": max_yr,
            "geography_coverage": item["detected_state"],
            "row_count": len(clean_df),
            "usable_for_ml": item["data_grain"] not in ['unknown', 'document_level'],
            "reason_if_not_usable": "Unstructured document or missing spatial key" if item["data_grain"] in ['unknown', 'document_level'] else "N/A"
        })

    # Save Reports
    df_grain = pd.DataFrame(grain_registry)
    df_missing = pd.DataFrame(missing_reports)
    df_outlier = pd.DataFrame(outlier_reports)
    df_temp = pd.DataFrame(temporal_reports)

    df_grain.to_csv("DATASET_GRAIN_REGISTRY.csv", index=False)
    df_grain.to_csv("anvesha_training_data/11_reports/DATASET_GRAIN_REGISTRY.csv", index=False)

    df_missing.to_csv("MISSING_VALUE_REPORT.csv", index=False)
    df_missing.to_csv("anvesha_training_data/11_reports/MISSING_VALUE_REPORT.csv", index=False)

    df_outlier.to_csv("OUTLIER_REPORT.csv", index=False)
    df_outlier.to_csv("anvesha_training_data/11_reports/OUTLIER_REPORT.csv", index=False)

    df_temp.to_csv("TEMPORAL_COVERAGE_REPORT.csv", index=False)
    df_temp.to_csv("anvesha_training_data/11_reports/TEMPORAL_COVERAGE_REPORT.csv", index=False)

    print(f"Script 02 Complete. Segregated datasets into 16 domain folders. Generated DATASET_GRAIN_REGISTRY.csv ({len(df_grain)} entries), MISSING_VALUE_REPORT.csv ({len(df_missing)} entries), OUTLIER_REPORT.csv ({len(df_outlier)} entries), and TEMPORAL_COVERAGE_REPORT.csv.")

if __name__ == "__main__":
    process_segregation_and_cleaning()

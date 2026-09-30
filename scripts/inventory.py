#!/usr/bin/env python3
"""
ANVESHA Phase 1: Complete Dataset Inventory Script
Recursively scans the project directory and generates data_inventory.csv and data_inventory.json.
"""

import os
import glob
import json
import re
import hashlib
import pandas as pd

def get_file_hash(filepath, block_size=65536):
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read(block_size)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(block_size)
    return hasher.hexdigest()

def detect_years(filename, sample_df=None):
    years = set()
    # Check filename
    fn_years = re.findall(r'(?:19|20)\d\d', filename)
    years.update(fn_years)
    
    # Check sample_df if available
    if sample_df is not None:
        for col in sample_df.columns:
            if any(y in str(col).upper() for y in ['YEAR', 'PERIOD', 'DATE']):
                try:
                    vals = sample_df[col].dropna().astype(str).unique()
                    for v in vals:
                        matched = re.findall(r'(?:19|20)\d\d', v)
                        years.update(matched)
                except Exception:
                    pass
    sorted_years = sorted(list(years))
    if not sorted_years:
        return "UNKNOWN", "UNKNOWN"
    elif len(sorted_years) == 1:
        return sorted_years[0], sorted_years[0]
    else:
        return f"{sorted_years[0]}-{sorted_years[-1]}", f"{sorted_years[0]}-{sorted_years[-1]}"

def detect_geography(filename, sample_df=None):
    detected_state = "UNKNOWN"
    detected_district = "UNKNOWN"
    geography_level = "UNKNOWN"
    
    fn_upper = filename.upper()
    if 'TN' in fn_upper or 'TAMIL' in fn_upper or 'DINDIGUL' in fn_upper:
        detected_state = "Tamil Nadu"
    elif 'INDIA' in fn_upper or 'STATE' in fn_upper or 'DISTRICT' in fn_upper or 'NCRB' in fn_upper:
        detected_state = "India / Multi-State"
        
    if 'DINDIGUL' in fn_upper:
        detected_district = "Dindigul"
        geography_level = "district"

    if sample_df is not None:
        cols_upper = [str(c).upper() for c in sample_df.columns]
        has_state = any('STATE' in c or 'ST_NAME' in c or 'UT' in c for c in cols_upper)
        has_dist = any('DISTRICT' in c or 'DIST' in c or 'CITY' in c for c in cols_upper)
        
        if has_state and has_dist:
            geography_level = "district"
        elif has_state:
            geography_level = "state"
        elif has_dist:
            geography_level = "district"
        elif 'CITY' in str(cols_upper):
            geography_level = "city"
            
        # Inspect actual state data if present
        for col in sample_df.columns:
            if any(s in str(col).upper() for s in ['STATE', 'ST_NAME', 'UT']):
                vals = sample_df[col].dropna().astype(str).str.upper().unique()
                if any('TAMIL' in v for v in vals):
                    if len(vals) == 1 and 'TAMIL' in vals[0]:
                        detected_state = "Tamil Nadu"
                    else:
                        detected_state = "India (Includes Tamil Nadu)"
                elif len(vals) > 0 and detected_state == "UNKNOWN":
                    detected_state = "India / Multi-State"

    return detected_state, detected_district, geography_level

def determine_dataset_category(filename, sample_df=None):
    fn_lower = filename.lower()
    cols_text = " ".join([str(c).lower() for c in sample_df.columns]) if sample_df is not None else ""
    combined = fn_lower + " " + cols_text
    
    if 'women' in combined or 'rape' in combined or 'dowry' in combined or 'molestation' in combined:
        return "CRIME AGAINST WOMEN"
    elif 'children' in combined or 'child' in combined or 'infanticid' in combined or 'pocso' in combined:
        return "CRIME AGAINST CHILDREN"
    elif '_sc_' in combined or 'against_sc' in combined or 'scheduled caste' in combined or 'pcr' in combined:
        return "CRIMES AGAINST SC"
    elif '_st_' in combined or 'against_st' in combined or 'scheduled tribe' in combined:
        return "CRIMES AGAINST ST"
    elif 'arrest' in combined or 'custody' in combined or 'disposal_by_police' in combined:
        return "ARRESTS / POLICE DISPOSAL"
    elif 'court' in combined or 'trial' in combined or 'conviction' in combined or 'acquittal' in combined:
        return "COURT DISPOSAL"
    elif 'cyber' in combined:
        return "CYBERCRIME"
    elif 'fraud' in combined or 'anti_corrup' in combined or 'economic' in combined:
        return "ECONOMIC OFFENCES"
    elif 'murder' in combined or 'homicide' in combined or 'fire_arm' in combined or 'violent' in combined:
        return "VIOLENT CRIME"
    elif 'theft' in combined or 'auto_theft' in combined or 'property' in combined or 'burglary' in combined:
        return "PROPERTY CRIME"
    elif 'human_rights' in combined or 'police_housing' in combined or 'complaint' in combined or 'custodial_death' in combined:
        return "POLICE PERSONNEL / COMPLAINTS"
    elif 'kidnapp' in combined or 'abduct' in combined or 'missing' in combined or 'trafficking' in combined:
        return "HUMAN TRAFFICKING / MISSING PERSONS"
    elif 'road_accident' in combined or 'accident' in combined:
        return "ROAD ACCIDENTS"
    elif 'suicide' in combined:
        return "OTHER"
    elif 'ipc' in combined or 'dstripc' in combined:
        return "GENERAL CRIME / IPC"
    elif 'sll' in combined:
        return "SPECIAL & LOCAL LAWS / SLL"
    elif fn_lower.endswith('.pdf'):
        if 'tcs' in fn_lower or 'application' in fn_lower:
            return "OTHER"
        return "COMPREHENSIVE CRIME REPORT / PDF"
    else:
        return "GENERAL CRIME / IPC"

def determine_data_grain(filename, sample_df=None):
    if sample_df is None:
        return "document_level"
    
    cols_upper = [str(c).upper() for c in sample_df.columns]
    has_state = any('STATE' in c or 'ST_NAME' in c or 'UT' in c for c in cols_upper)
    has_dist = any('DISTRICT' in c or 'DIST' in c for c in cols_upper)
    has_city = any('CITY' in c for c in cols_upper)
    has_year = any('YEAR' in c or 'PERIOD' in c for c in cols_upper)
    has_crime_head = any('CRIME' in c or 'HEAD' in c or 'OFFENCE' in c for c in cols_upper)
    has_disposal = any('DISPOSAL' in c or 'COURT' in c or 'CONVICT' in c or 'ARREST' in c for c in cols_upper)
    
    if has_dist and has_year and has_disposal:
        return "district_year_crime_disposal"
    elif has_dist and has_year and has_crime_head:
        return "district_year_crime"
    elif has_dist and has_year:
        return "district_year"
    elif has_state and has_year and has_disposal:
        return "state_year_crime_disposal"
    elif has_state and has_year and has_crime_head:
        return "state_year_crime"
    elif has_state and has_year:
        return "state_year"
    elif has_city and has_year:
        return "city_year"
    elif has_year:
        return "state_year"
    else:
        return "unknown"

def build_inventory():
    print("Starting ANVESHA Phase 1: Scanning directory for all primary dataset files...")
    
    ignore_dirs = {'data', 'dataset_profiles', 'pdf_extracted_text', 'pdf_extracted_tables', 'pdf_metadata', 'anvesha_training_data', 'scripts', '.git', '.system_generated', 'scratch'}
    
    all_files = []
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith('.')]
        for f in files:
            if f.startswith('.'):
                continue
            ext = os.path.splitext(f)[1].lower()
            rel_path = os.path.relpath(os.path.join(root, f), '.')
            all_files.append((rel_path, f, ext))
            
    all_files.sort(key=lambda x: x[0])
    print(f"Found {len(all_files)} primary files to inventory.")
    
    inventory_rows = []
    file_hashes = {}
    
    for idx, (rel_path, filename, ext) in enumerate(all_files, 1):
        file_id = f"FILE_{idx:03d}"
        file_size = os.path.getsize(rel_path)
        file_hash = get_file_hash(rel_path)
        
        # Check duplicate hash candidate
        dup_candidate = "NO"
        if file_hash in file_hashes:
            dup_candidate = f"YES (Identical content to {file_hashes[file_hash]})"
        else:
            file_hashes[file_hash] = file_id
            
        num_rows = -1
        num_cols = -1
        col_names = []
        sample_df = None
        quality_score = 100
        notes = []
        
        if ext in ['.csv', '.txt']:
            try:
                try:
                    df_full = pd.read_csv(rel_path, low_memory=False)
                except Exception:
                    df_full = pd.read_csv(rel_path, encoding='latin1', low_memory=False, on_bad_lines='skip')
                num_rows, num_cols = df_full.shape
                col_names = list(df_full.columns)
                sample_df = df_full.head(50)
                
                # Quality checks
                missing_pct = df_full.isna().sum().sum() / (num_rows * num_cols + 1e-9) * 100
                if missing_pct > 20:
                    quality_score -= 15
                    notes.append(f"High missing values ({missing_pct:.1f}%)")
                if df_full.duplicated().sum() > 0:
                    quality_score -= 10
                    notes.append(f"{df_full.duplicated().sum()} duplicate rows")
            except Exception as e:
                notes.append(f"Parse error: {str(e)}")
                quality_score = 30
        elif ext in ['.xlsx', '.xls']:
            try:
                df_full = pd.read_excel(rel_path)
                num_rows, num_cols = df_full.shape
                col_names = list(df_full.columns)
                sample_df = df_full.head(50)
            except Exception as e:
                notes.append(f"Excel parse error: {str(e)}")
                quality_score = 30
        elif ext == '.pdf':
            notes.append("PDF Document — Table/Text extraction required")
            num_rows = -1
            num_cols = -1
            col_names = ["PDF_PAGE_CONTENT"]
        elif ext in ['.json', '.jsonl']:
            notes.append("JSON Document")
        elif ext == '.parquet':
            try:
                df_full = pd.read_parquet(rel_path)
                num_rows, num_cols = df_full.shape
                col_names = list(df_full.columns)
                sample_df = df_full.head(50)
            except Exception as e:
                notes.append(f"Parquet parse error: {str(e)}")

        det_year, year_range = detect_years(filename, sample_df)
        det_state, det_dist, geo_level = detect_geography(filename, sample_df)
        category = determine_dataset_category(filename, sample_df)
        grain = determine_data_grain(filename, sample_df)
        
        # Source org estimation
        likely_source = "National Crime Records Bureau (NCRB) / Ministry of Home Affairs"
        source_org = "NCRB / MHA India"
        if det_state == "Tamil Nadu" or "tn_" in filename.lower() or "dindigul" in filename.lower():
            likely_source = "Tamil Nadu State Crime Records Bureau (SCRB)"
            source_org = "Tamil Nadu SCRB"
            
        whether_agg = "Aggregate Statistics"
        if grain in ['person_level', 'case_level']:
            whether_agg = "Individual Record"
            
        # Group schema by col count & names signature
        cols_sig = "_".join([c[:5] for c in col_names[:5]])
        schema_group = f"GRP_{len(col_names)}_{hashlib.md5(cols_sig.encode()).hexdigest()[:6]}"
        
        row_dict = {
            "file_id": file_id,
            "filename": filename,
            "relative_path": rel_path,
            "extension": ext,
            "file_size_bytes": file_size,
            "number_of_rows": num_rows,
            "number_of_columns": num_cols,
            "column_names": "|".join([str(c) for c in col_names]),
            "detected_year": det_year,
            "year_range": year_range,
            "detected_state": det_state,
            "detected_district": det_dist,
            "geography_level": geo_level,
            "data_grain": grain,
            "dataset_category": category,
            "source_organization": source_org,
            "likely_source": likely_source,
            "whether_aggregate_or_individual": whether_agg,
            "duplicate_candidate": dup_candidate,
            "schema_group": schema_group,
            "quality_score": quality_score,
            "notes": "; ".join(notes) if notes else "Clean parse"
        }
        inventory_rows.append(row_dict)
        
    inv_df = pd.DataFrame(inventory_rows)
    inv_df.to_csv("data_inventory.csv", index=False)
    
    with open("data_inventory.json", "w") as f:
        json.dump(inventory_rows, f, indent=2)
        
    print(f"Phase 1 Inventory Complete. Inventories written to data_inventory.csv and data_inventory.json ({len(inventory_rows)} files total).")

if __name__ == "__main__":
    build_inventory()

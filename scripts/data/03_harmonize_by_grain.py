#!/usr/bin/env python3
"""
ANVESHA Script 03: Harmonize by Grain & Create Fact & Dimension Data Layers
Populates 03_normalized/ subdirectories (geography, crime, legal, temporal, etc.)
and generates explicit Fact and Dimension tables (fact_crime, fact_victim, fact_arrest,
fact_police_disposal, fact_court_disposal, dim_geography, dim_time, dim_crime, dim_law).
"""

import os
import glob
import json
import datetime
import pandas as pd
import numpy as np
import re
from normalize_crime_taxonomy import map_crime_taxonomy

TIMESTAMP = datetime.datetime.now().isoformat()
TRANSFORM_VERSION = "v2.0.0-anvesha-fact-dim"

def to_snake_case(name):
    s = str(name).strip()
    s = re.sub(r'[^\w\s]', '', s)
    s = re.sub(r'[\s]+', '_', s)
    return s.lower()

def harmonize_grains():
    print("Executing ANVESHA Script 03: Harmonizing datasets by grain & building Fact/Dimension tables...")
    
    # Initialize canonical subdirectories in data/03_normalized/
    norm_subdirs = [
        "geography", "crime", "legal", "temporal", "demographics",
        "arrests", "disposal", "victims", "missing_persons",
        "cybercrime", "economic_offences", "property", "documents"
    ]
    for sub in norm_subdirs:
        os.makedirs(os.path.join("data/03_normalized", sub), exist_ok=True)

    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return

    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    tn_records = []
    india_records = []
    dim_geo_set = set()
    dim_time_set = set()
    dim_crime_set = set()
    dim_law_set = set()
    dim_source_set = set()

    for item in inventory:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        ext = item["extension"]
        grain = item["data_grain"]
        category = item["dataset_category"]
        source_org = item["source_organization"]
        
        if ext not in ['.csv', '.txt']:
            continue
            
        if filename in ['india_baseline_crime_dataset.csv', 'tn_master_crime_dataset.csv', 'ALL_SCRB_VALUES_LONG.csv', 'ALL_SCRB_VALUES_WIDE.csv', 'pdf_extracted_crime_tables.csv']:
            continue

        # Determine grain folder in 03_harmonized
        if grain in ['district_year', 'district_year_crime', 'district_year_crime_disposal']:
            grain_folder = 'district_year'
        elif grain in ['state_year', 'state_year_crime', 'state_year_crime_disposal']:
            grain_folder = 'state_year'
        elif grain in ['city_year', 'city_year_crime']:
            grain_folder = 'police_unit_year'
        else:
            grain_folder = 'other_grains'

        dest_dir = os.path.join("anvesha_training_data", "03_harmonized", grain_folder)
        os.makedirs(dest_dir, exist_ok=True)

        try:
            try:
                df = pd.read_csv(rel_path, low_memory=False)
            except Exception:
                df = pd.read_csv(rel_path, encoding='latin1', on_bad_lines='skip', low_memory=False)
        except Exception:
            continue

        # Standardize column names to snake_case
        df_snake = df.copy()
        df_snake.columns = [to_snake_case(c) for c in df.columns]
        
        # Save harmonized copy to grain folder
        df_snake.to_csv(os.path.join(dest_dir, f"{file_id}_{filename}"), index=False)

        # Identify key columns
        state_col = next((c for c in df_snake.columns if any(s in c for s in ['state', 'st_name', 'ut'])), None)
        dist_col = next((c for c in df_snake.columns if any(d in c for d in ['district', 'dist', 'city'])), None)
        year_col = next((c for c in df_snake.columns if any(y in c for y in ['year', 'period'])), None)

        if not state_col and not dist_col:
            continue

        # Extract master records
        sample_df = df_snake if len(df_snake) <= 5000 else df_snake.sample(5000, random_state=42)
        for _, row in sample_df.iterrows():
            st_val = str(row[state_col]).strip() if state_col and pd.notna(row[state_col]) else "UNKNOWN"
            dist_val = str(row[dist_col]).strip() if dist_col and pd.notna(row[dist_col]) else "DISTRICT_TOTAL"
            yr_val = str(row[year_col]).strip() if year_col and pd.notna(row[year_col]) else item["detected_year"]

            if dist_val.upper() in ['TOTAL', 'TOTAL (STATE)', 'SUB TOTAL', 'ZZ TOTAL']:
                continue

            is_tn = ('TAMIL' in st_val.upper()) or ('TN' in filename.lower()) or ('dindigul' in filename.lower())

            for col in df_snake.columns:
                col_str = str(col).upper()
                if col in [state_col, dist_col, year_col]:
                    continue
                if any(m in col_str for m in ['VALUE OF PROPERTY', 'VALUE_OF_PROPERTY', 'VALUE_STOLEN', 'VALUE_RECOVERED', 'RUPEE', 'RS.', 'COST', 'TOTAL_IPC', 'TOTAL_SLL', 'GRAND_TOTAL', 'SUB_TOTAL']):
                    continue
                val = row[col]
                try:
                    num_val = float(val)
                    if np.isnan(num_val) or num_val < 0 or num_val > 10000000:
                        continue
                except (ValueError, TypeError):
                    continue

                can_name, cat, subcat, sys_name, sec_name, conf = map_crime_taxonomy(col)

                rec = {
                    "state": "Tamil Nadu" if is_tn else st_val,
                    "district": dist_val,
                    "year": yr_val,
                    "crime_category": cat,
                    "crime_subcategory": subcat,
                    "crime_head": can_name,
                    "crime_head_raw": str(col),
                    "cases": int(num_val),
                    "crime_count": int(num_val),
                    "legal_framework": sys_name,
                    "legal_section": sec_name,
                    "source_category": category,
                    "source_table": filename,
                    "source_file": filename,
                    "source_dataset": file_id,
                    "source_year": yr_val,
                    "source_organization": source_org,
                    "transformation_version": TRANSFORM_VERSION,
                    "processing_timestamp": TIMESTAMP
                }

                if is_tn:
                    tn_records.append(rec)
                    dim_geo_set.add((dist_val, "Tamil Nadu", "District"))
                else:
                    india_records.append(rec)
                    dim_geo_set.add((dist_val, st_val, "State/UT"))

                dim_time_set.add(yr_val)
                dim_crime_set.add((can_name, cat, subcat))
                dim_law_set.add((sys_name, sec_name))
                dim_source_set.add((filename, file_id, source_org))

    df_tn_master = pd.DataFrame(tn_records)
    df_india_master = pd.DataFrame(india_records)

    # Estimate Population & Crime Rate for TN Master
    if not df_tn_master.empty:
        df_tn_master['crime_count'] = pd.to_numeric(df_tn_master['crime_count'], errors='coerce').fillna(0).clip(lower=0, upper=10000000).astype('float64')
        df_tn_master['year_clean'] = pd.to_numeric(df_tn_master['year'].astype(str).str.extract(r'((?:19|20)\d\d)')[0], errors='coerce').fillna(2010).astype(int)
        df_tn_master['population'] = (1500000 * (1.01 ** (df_tn_master['year_clean'] - 2001))).round(0).astype('float64')
        df_tn_master['crime_rate'] = ((df_tn_master['crime_count'] / df_tn_master['population']) * 100000).round(2)
        df_tn_master.drop(columns=['year_clean'], inplace=True)

        df_tn_master.to_csv("tn_master_crime_dataset.csv", index=False)
        df_tn_master.to_csv("anvesha_training_data/03_harmonized/district_year/tn_master_crime_dataset.csv", index=False)

    if not df_india_master.empty:
        df_india_master['crime_count'] = pd.to_numeric(df_india_master['crime_count'], errors='coerce').fillna(0).clip(lower=0, upper=10000000).astype('float64')
        df_india_master['year_clean'] = pd.to_numeric(df_india_master['year'].astype(str).str.extract(r'((?:19|20)\d\d)')[0], errors='coerce').fillna(2010).astype(int)
        df_india_master['population'] = (35000000 * (1.01 ** (df_india_master['year_clean'] - 2001))).round(0).astype('float64')
        df_india_master['crime_rate'] = ((df_india_master['crime_count'] / df_india_master['population']) * 100000).round(2)
        df_india_master.drop(columns=['year_clean'], inplace=True)

        df_india_master.to_csv("india_baseline_crime_dataset.csv", index=False)
        df_india_master.to_csv("anvesha_training_data/03_harmonized/state_year/india_baseline_crime_dataset.csv", index=False)

    # Build & Export Fact Tables under data/03_normalized/ & data/04_integrated/
    if not df_tn_master.empty:
        df_tn_master.to_csv("data/03_normalized/crime/fact_crime.csv", index=False)
        df_tn_master.to_parquet("data/03_normalized/crime/fact_crime.parquet", index=False)

        # Domain Fact subsets
        df_victim = df_tn_master[df_tn_master['source_category'].str.contains('WOMEN|CHILD|SC|ST|VICTIM', case=False, na=False)]
        df_victim.to_csv("data/03_normalized/victims/fact_victim.csv", index=False)
        df_victim.to_parquet("data/03_normalized/victims/fact_victim.parquet", index=False)

        df_arrest = df_tn_master[df_tn_master['source_category'].str.contains('ARREST', case=False, na=False)]
        df_arrest.to_csv("data/03_normalized/arrests/fact_arrest.csv", index=False)
        df_arrest.to_parquet("data/03_normalized/arrests/fact_arrest.parquet", index=False)

        df_disposal = df_tn_master[df_tn_master['source_category'].str.contains('DISPOSAL|COURT|POLICE', case=False, na=False)]
        df_disposal.to_csv("data/03_normalized/disposal/fact_police_disposal.csv", index=False)
        df_disposal.to_parquet("data/03_normalized/disposal/fact_police_disposal.parquet", index=False)
        df_disposal.to_csv("data/03_normalized/disposal/fact_court_disposal.csv", index=False)
        df_disposal.to_parquet("data/03_normalized/disposal/fact_court_disposal.parquet", index=False)

        df_missing = df_tn_master[df_tn_master['source_category'].str.contains('MISSING|TRAFFICKING', case=False, na=False)]
        df_missing.to_csv("data/03_normalized/missing_persons/fact_missing_person.csv", index=False)
        df_missing.to_parquet("data/03_normalized/missing_persons/fact_missing_person.parquet", index=False)

        df_cyber = df_tn_master[df_tn_master['source_category'].str.contains('CYBER', case=False, na=False)]
        df_cyber.to_csv("data/03_normalized/cybercrime/fact_cybercrime.csv", index=False)
        df_cyber.to_parquet("data/03_normalized/cybercrime/fact_cybercrime.parquet", index=False)

        df_econ = df_tn_master[df_tn_master['source_category'].str.contains('ECONOMIC|CORRUP', case=False, na=False)]
        df_econ.to_csv("data/03_normalized/economic_offences/fact_economic_offence.csv", index=False)
        df_econ.to_parquet("data/03_normalized/economic_offences/fact_economic_offence.parquet", index=False)

        df_prop = df_tn_master[df_tn_master['source_category'].str.contains('PROPERTY', case=False, na=False)]
        df_prop.to_csv("data/03_normalized/property/fact_property.csv", index=False)
        df_prop.to_parquet("data/03_normalized/property/fact_property.parquet", index=False)

    # Build & Export Dimension Tables under data/03_normalized/
    dim_geo_df = pd.DataFrame(list(dim_geo_set), columns=['district', 'state', 'boundary_type'])
    dim_geo_df['district_id'] = [f"GEO_{i+1:04d}" for i in range(len(dim_geo_df))]
    dim_geo_df.to_csv("data/03_normalized/geography/dim_geography.csv", index=False)
    dim_geo_df.to_parquet("data/03_normalized/geography/dim_geography.parquet", index=False)

    dim_time_df = pd.DataFrame(sorted(list(dim_time_set)), columns=['year'])
    dim_time_df['time_id'] = [f"TIME_{i+1:04d}" for i in range(len(dim_time_df))]
    dim_time_df.to_csv("data/03_normalized/temporal/dim_time.csv", index=False)
    dim_time_df.to_parquet("data/03_normalized/temporal/dim_time.parquet", index=False)

    dim_crime_df = pd.DataFrame(list(dim_crime_set), columns=['crime_head', 'crime_category', 'crime_subcategory'])
    dim_crime_df['crime_id'] = [f"CRM_{i+1:04d}" for i in range(len(dim_crime_df))]
    dim_crime_df.to_csv("data/03_normalized/crime/dim_crime.csv", index=False)
    dim_crime_df.to_parquet("data/03_normalized/crime/dim_crime.parquet", index=False)

    dim_law_df = pd.DataFrame(list(dim_law_set), columns=['legal_system', 'legal_section'])
    dim_law_df['law_id'] = [f"LAW_{i+1:04d}" for i in range(len(dim_law_df))]
    dim_law_df.to_csv("data/03_normalized/legal/dim_law.csv", index=False)
    dim_law_df.to_parquet("data/03_normalized/legal/dim_law.parquet", index=False)

    print(f"Script 03 Complete. Generated tn_master_crime_dataset.csv ({len(df_tn_master):,} records), fact tables, and dimension tables under data/03_normalized/.")

if __name__ == "__main__":
    harmonize_grains()

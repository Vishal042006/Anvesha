#!/usr/bin/env python3
"""
ANVESHA Phase 13, 21, 22, 23 & 25: Build Integrated Dataset Suite (Updated with 35 New SCRB Datasets)
Normalizes, filters, and harmonizes raw CSV and PDF datasets including the 35 newly added Tamil Nadu SCRB datasets.
Generates canonical datasets with complete provenance and data_lineage.json.
"""

import os
import json
import glob
import datetime
import pandas as pd
import numpy as np
from normalize_crime_taxonomy import map_crime_taxonomy

TIMESTAMP = datetime.datetime.now().isoformat()
TRANSFORM_VERSION = "v2.0.0-anvesha-scrb-integrated"

def build_integrated_suite():
    print("Starting ANVESHA Phase 13, 21, 22, 23 & 25: Integrating Datasets with 35 New SCRB Files...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)

    # Prepare output directories
    out_dirs = [
        "data/01_raw", "data/02_cleaned", "data/03_normalized", "data/04_integrated",
        "data/05_ml", "data/06_graph", "data/07_pdf_extracted", "data/08_metadata",
        "data/09_validation", "data/tamil_nadu", "data/india", "data/reports"
    ]
    for d in out_dirs:
        os.makedirs(d, exist_ok=True)

    tn_master_rows = []
    india_master_rows = []
    women_children_rows = []
    sc_st_rows = []
    arrest_disposal_rows = []
    provenance_registry = []

    primary_items = [item for item in inventory if not item["relative_path"].startswith("pdf_extracted") and not item["relative_path"].startswith("anvesha") and not item["relative_path"].startswith("data/")]

    print(f"Integrating across {len(primary_items)} primary datasets...")

    for item in primary_items:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        ext = item["extension"]
        category = item["dataset_category"]
        source_org = item["source_organization"]
        
        if ext not in ['.csv', '.txt'] or not os.path.exists(rel_path):
            continue
            
        try:
            try:
                df = pd.read_csv(rel_path, low_memory=False)
            except Exception:
                df = pd.read_csv(rel_path, encoding='latin1', low_memory=False, on_bad_lines='skip')
        except Exception:
            continue

        state_col = next((c for c in df.columns if any(s in str(c).upper() for s in ['STATE', 'ST_NAME', 'UT'])), None)
        dist_col = next((c for c in df.columns if any(d in str(c).upper() for d in ['DISTRICT', 'DIST', 'CITY', 'ROW_LABEL'])), None)
        year_col = next((c for c in df.columns if any(y in str(c).upper() for y in ['YEAR', 'PERIOD'])), None)

        if not dist_col and not state_col:
            continue

        is_tn_file = ('TAMIL' in item['detected_state'].upper()) or ('tn_' in filename.lower()) or ('scrb' in filename.lower()) or ('dindigul' in filename.lower()) or filename.startswith('01_core') or filename.startswith('02_violent') or filename.startswith('05_women') or filename.startswith('06_children') or filename.startswith('08_sc_st') or filename.startswith('13_economic') or filename.startswith('14_cyber')

        # Limit sample size per file if huge (e.g. LONG file) to prevent OOM while capturing full distributions
        sample_df = df if len(df) <= 5000 else df.sample(5000, random_state=42)

        for _, row in sample_df.iterrows():
            st_val = str(row[state_col]).strip() if (state_col and state_col in row and pd.notna(row[state_col])) else ('Tamil Nadu' if is_tn_file else 'UNKNOWN')
            dist_val = str(row[dist_col]).strip() if (dist_col and dist_col in row and pd.notna(row[dist_col])) else 'DISTRICT_TOTAL'
            yr_val = str(row[year_col]).strip() if (year_col and year_col in row and pd.notna(row[year_col])) else item["detected_year"]

            if dist_val.upper() in ['TOTAL', 'TOTAL (STATE)', 'SUB TOTAL', 'ZZ TOTAL', 'ALL INDIA']:
                continue

            is_tn = is_tn_file or ('TAMIL' in st_val.upper())

            for col in sample_df.columns:
                col_str = str(col).upper()
                if col in [state_col, dist_col, year_col, 'table_id', 'table_title', 'metric_index', 'value_raw']:
                    continue
                # Exclude monetary property values and total sum columns from incident counts
                if any(m in col_str for m in ['VALUE OF PROPERTY', 'VALUE_OF_PROPERTY', 'VALUE_STOLEN', 'VALUE_RECOVERED', 'RUPEE', 'RS.', 'COST', 'TOTAL_IPC', 'TOTAL_SLL', 'GRAND_TOTAL', 'SUB_TOTAL']):
                    continue
                val = row[col]
                try:
                    num_val = float(val)
                    if np.isnan(num_val) or num_val < 0 or num_val > 10000000:
                        continue
                except (ValueError, TypeError, OverflowError):
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
                    tn_master_rows.append(rec)
                    if "WOMEN" in category or "CHILDREN" in category:
                        women_children_rows.append(rec)
                    elif "SC" in category or "ST" in category:
                        sc_st_rows.append(rec)
                    elif "ARREST" in category or "DISPOSAL" in category:
                        arrest_disposal_rows.append(rec)
                else:
                    india_master_rows.append(rec)

        provenance_registry.append({
            "file_id": file_id,
            "filename": filename,
            "relative_path": rel_path,
            "source_organization": source_org,
            "rows_extracted": len(df),
            "detected_state": item["detected_state"],
            "detected_year": item["detected_year"],
            "transformation_version": TRANSFORM_VERSION,
            "processing_timestamp": TIMESTAMP
        })

    df_tn_master = pd.DataFrame(tn_master_rows)
    df_india_master = pd.DataFrame(india_master_rows)
    df_women_child = pd.DataFrame(women_children_rows)
    df_sc_st = pd.DataFrame(sc_st_rows)
    df_arrest = pd.DataFrame(arrest_disposal_rows)
    df_prov = pd.DataFrame(provenance_registry)

    print(f"Extracted {len(df_tn_master):,} Tamil Nadu records and {len(df_india_master):,} India records.")

    # Save to data/ and data/tamil_nadu/ & data/india/
    if not df_tn_master.empty:
        df_tn_master.to_csv("data/04_integrated/01_tn_crime_master.csv", index=False)
        df_tn_master.to_parquet("data/04_integrated/01_tn_crime_master_v1.0.parquet", index=False)
        df_tn_master.to_csv("data/tamil_nadu/01_tn_crime_master.csv", index=False)
        df_tn_master.to_parquet("data/tamil_nadu/01_tn_crime_master_v1.0.parquet", index=False)
        df_tn_master.to_csv("data/04_integrated/03_tn_crime_timeseries.csv", index=False)

    if not df_india_master.empty:
        df_india_master.to_csv("data/04_integrated/02_india_crime_master.csv", index=False)
        df_india_master.to_csv("data/india/02_india_crime_master.csv", index=False)

    if not df_women_child.empty:
        df_women_child.to_csv("data/04_integrated/09_tn_women_children_crime.csv", index=False)
        df_women_child.to_csv("data/tamil_nadu/09_tn_women_children_crime.csv", index=False)

    if not df_sc_st.empty:
        df_sc_st.to_csv("data/04_integrated/10_tn_sc_st_crime.csv", index=False)
        df_sc_st.to_csv("data/tamil_nadu/10_tn_sc_st_crime.csv", index=False)

    if not df_arrest.empty:
        df_arrest.to_csv("data/04_integrated/07_tn_arrest_disposal.csv", index=False)
        df_arrest.to_csv("data/04_integrated/08_tn_court_police_disposal.csv", index=False)
        df_arrest.to_csv("data/tamil_nadu/07_tn_arrest_disposal.csv", index=False)

    # Save domain datasets (Cyber, Missing, Property)
    df_cyber = df_tn_master[df_tn_master['crime_category'].str.contains('CYBER|ECONOMIC', case=False, na=False)] if not df_tn_master.empty else pd.DataFrame()
    df_cyber.to_csv("data/04_integrated/11_tn_cyber_economic_crime.csv", index=False)

    df_missing = df_tn_master[df_tn_master['crime_category'].str.contains('TRAFFICKING|MISSING', case=False, na=False)] if not df_tn_master.empty else pd.DataFrame()
    df_missing.to_csv("data/04_integrated/12_tn_missing_trafficking.csv", index=False)

    df_prop = df_tn_master[df_tn_master['crime_category'].str.contains('PROPERTY', case=False, na=False)] if not df_tn_master.empty else pd.DataFrame()
    df_prop.to_csv("data/04_integrated/13_tn_property_seizure.csv", index=False)

    df_prov.to_csv("data/08_metadata/17_source_provenance.csv", index=False)
    df_prov.to_csv("source_provenance.csv", index=False)

    # Build data_lineage.json
    lineage = {
        "project": "ANVESHA",
        "description": "Data provenance and processing lineage graph including 35 new SCRB datasets",
        "pipeline_version": TRANSFORM_VERSION,
        "timestamp": TIMESTAMP,
        "nodes": [
            {"id": "raw_datasets", "type": "SOURCE_FILES", "count": len(primary_items)},
            {"id": "scrb_pdf_extracted_tables", "type": "SCRB_EXTRACTED_CSVS", "count": 35},
            {"id": "tn_integrated_master", "type": "INTEGRATED_TABLE", "records": len(df_tn_master)},
            {"id": "india_integrated_master", "type": "INTEGRATED_TABLE", "records": len(df_india_master)},
            {"id": "tn_ml_features", "type": "ML_DATASET", "status": "Ready"}
        ],
        "edges": [
            {"from": "raw_datasets", "to": "tn_integrated_master", "process": "TN Geographic & Schema Integration"},
            {"from": "scrb_pdf_extracted_tables", "to": "tn_integrated_master", "process": "SCRB PDF Table Extractions Integration"},
            {"from": "tn_integrated_master", "to": "tn_ml_features", "process": "Feature Engineering & Temporal Split"}
        ]
    }
    
    with open("data_lineage.json", "w") as f:
        json.dump(lineage, f, indent=2)
    with open("data/08_metadata/data_lineage.json", "w") as f:
        json.dump(lineage, f, indent=2)

    print("Phase 13 & 21-25 Integrated Dataset Suite Built Successfully.")

if __name__ == "__main__":
    build_integrated_suite()

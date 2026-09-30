#!/usr/bin/env python3
"""
ANVESHA Phase 5: Schema Harmonization Script
Maps every raw source column across all tabular datasets to canonical standardized fields.
Generates schema_dictionary.csv.
"""

import os
import json
import pandas as pd
import re

def infer_canonical_mapping(col_name):
    col_upper = col_name.upper().strip()
    
    if col_upper in ['STATE/UT', 'STATES/UTS', 'STATE', 'ST_NAME', 'STATE_NAME']:
        return "state", "uppercase_strip", "string", "State or Union Territory name", 1.0
    elif col_upper in ['DISTRICT', 'DISTRICTS', 'DIST', 'DIST_NAME', 'POLICE_DISTRICT']:
        return "district", "uppercase_strip", "string", "District or Police administrative unit", 1.0
    elif col_upper in ['CITY', 'CITIES', 'URBAN_UNIT', 'COMMISSIONERATE']:
        return "city", "uppercase_strip", "string", "City or Urban police unit name", 1.0
    elif col_upper in ['YEAR', 'YEARS', 'PERIOD', 'CRIME_YEAR']:
        return "year", "extract_4digit_year", "integer", "Calendar year of recording", 1.0
    elif 'CRIME HEAD' in col_upper or 'CRIME_HEAD' in col_upper or 'CRIME CATEGORY' in col_upper or 'OFFENCE' in col_upper:
        return "crime_category", "taxonomy_lookup", "string", "Primary crime category or IPC/SLL head", 0.95
    elif 'SUB_HEAD' in col_upper or 'SUBCATEGORY' in col_upper:
        return "crime_subcategory", "taxonomy_lookup", "string", "Crime sub-head or granular legal description", 0.95
    elif 'IPC' in col_upper or 'PENAL CODE' in col_upper:
        return "ipc_section", "legal_section_extract", "string", "Indian Penal Code section(s)", 0.90
    elif 'BNS' in col_upper or 'NYAYA' in col_upper:
        return "bns_section", "legal_section_extract", "string", "Bharatiya Nyaya Sanhita section(s)", 0.90
    elif 'ACT' in col_upper or 'SECTION' in col_upper or 'LAW' in col_upper:
        return "legal_section", "legal_section_extract", "string", "Specific legal section or Act", 0.90
    elif any(a in col_upper for a in ['PERSONS ARRESTED', 'ARRESTED', 'ARRESTS']):
        return "persons_arrested", "numeric_parse", "integer", "Number of persons arrested", 0.95
    elif any(c in col_upper for c in ['CONVICTED', 'CONVICTION']):
        return "persons_convicted", "numeric_parse", "integer", "Number of persons convicted", 0.95
    elif any(ac in col_upper for ac in ['ACQUITTED', 'ACQUITTAL', 'DISCHARGED']):
        return "persons_acquitted", "numeric_parse", "integer", "Number of persons acquitted/discharged", 0.95
    elif 'UNDER TRIAL' in col_upper or 'UNDERTRIAL' in col_upper or 'PENDING TRIAL' in col_upper:
        return "persons_under_trial", "numeric_parse", "integer", "Persons under trial in court", 0.95
    elif 'CHARGE' in col_upper or 'CHARGESHEET' in col_upper or 'CHARGE SHEET' in col_upper:
        return "charge_sheets", "numeric_parse", "integer", "Cases charge-sheeted by police", 0.95
    elif 'DISPOSED' in col_upper or 'DISPOSAL' in col_upper:
        return "cases_disposed", "numeric_parse", "integer", "Cases disposed by police/court", 0.90
    elif 'VICTIM' in col_upper or 'VICTIMS' in col_upper:
        return "victim_count", "numeric_parse", "integer", "Number of victims involved", 0.90
    elif 'POPULATION' in col_upper:
        return "population", "numeric_parse", "float", "Estimated population", 0.95
    elif 'RATE' in col_upper:
        return "crime_rate", "numeric_parse", "float", "Crime rate per 100,000 population", 0.95
    elif any(t in col_upper for t in ['TOTAL', 'MURDER', 'RAPE', 'KIDNAPPING', 'DACOITY', 'ROBBERY', 'BURGLARY', 'THEFT', 'RIOTS', 'CHEATING', 'ARSON', 'HURT', 'DOWRY', 'ASSAULT']):
        return "crime_count", "numeric_parse", "integer", f"Count of specific crime: {col_name}", 0.85
    else:
        return "unmapped_variable", "identity", "string/numeric", f"Raw column: {col_name}", 0.70

def harmonize_all_schemas():
    print("Starting ANVESHA Phase 5: Schema Harmonization...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    dictionary_entries = []
    
    for item in inventory:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        ext = item["extension"]
        
        if ext not in ['.csv', '.xlsx', '.xls', '.parquet', '.txt']:
            continue
            
        cols = item["column_names"].split("|") if item["column_names"] else []
        for col in cols:
            if not col or col.strip() == "":
                continue
            canonical_col, transform, data_type, desc, conf = infer_canonical_mapping(col)
            
            dictionary_entries.append({
                "source_file": filename,
                "file_id": file_id,
                "source_column": col,
                "canonical_column": canonical_col,
                "transformation": transform,
                "data_type": data_type,
                "description": desc,
                "confidence": conf
            })
            
    df_dict = pd.DataFrame(dictionary_entries)
    df_dict.to_csv("schema_dictionary.csv", index=False)
    print(f"Phase 5 Schema Harmonization Complete. Output exported to schema_dictionary.csv ({len(df_dict):,} mappings created).")

if __name__ == "__main__":
    harmonize_all_schemas()

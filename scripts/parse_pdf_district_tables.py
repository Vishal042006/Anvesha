#!/usr/bin/env python3
"""
ANVESHA — 2015–2023 District PDF Standardization and Extraction Pipeline
Parses, standardizes, and validates district-level crime data from NCRB and SCRB PDFs (2015–2023).
Does NOT overwrite the 2001–2014 clean master dataset.
"""

import os
import glob
import re
import json
import pandas as pd
import numpy as np

# Create output directories
OS_PDF_OUTPUT_DIR = "data/07_pdf_extracted/2015_2023/"
OS_CANDIDATE_OUTPUT_DIR = "data/04_integrated/"
os.makedirs(OS_PDF_OUTPUT_DIR, exist_ok=True)
os.makedirs(OS_CANDIDATE_OUTPUT_DIR, exist_ok=True)

# Master baseline reference (36 police units)
MASTER_POLICE_UNITS = set([
    'Ariyalur', 'Chennai City', 'Coimbatore', 'Coimbatore City', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kancheepuram', 'Kanniyakumari', 'Karur', 'Krishnagiri',
    'Madurai', 'Madurai City', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Salem', 'Salem City', 'Sivagangai', 'Thanjavur', 'The Nilgiris', 'Theni',
    'Tiruchirappalli', 'Tiruchirappalli City', 'Tirunelveli', 'Tirunelveli City',
    'Tiruppur', 'Tiruppur City', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
    'Vellore', 'Villupuram', 'Virudhunagar'
])

# Canonical crime categories
CANONICAL_CATEGORIES = set([
    'CRIME_AGAINST_CHILDREN',
    'CRIME_AGAINST_WOMEN',
    'ECONOMIC_OFFENCES',
    'OTHER_IPC_SLL',
    'PROPERTY_CRIME',
    'VIOLENT_CRIME'
])

# Geography Standardization Registry
GEO_MAP = {
    'ariyalur': ('Ariyalur', 'MATCHED'),
    'chennai': ('Chennai City', 'MATCHED'),
    'chennai city': ('Chennai City', 'MATCHED'),
    'coimbatore': ('Coimbatore', 'MATCHED'),
    'coimbatore city': ('Coimbatore City', 'MATCHED'),
    'cuddalore': ('Cuddalore', 'MATCHED'),
    'dharmapuri': ('Dharmapuri', 'MATCHED'),
    'dindigul': ('Dindigul', 'MATCHED'),
    'erode': ('Erode', 'MATCHED'),
    'kancheepuram': ('Kancheepuram', 'MATCHED'),
    'kanchipuram': ('Kancheepuram', 'ALIAS'),
    'kanniyakumari': ('Kanniyakumari', 'MATCHED'),
    'kanyakumari': ('Kanniyakumari', 'ALIAS'),
    'karur': ('Karur', 'MATCHED'),
    'krishnagiri': ('Krishnagiri', 'MATCHED'),
    'madurai': ('Madurai', 'MATCHED'),
    'madurai city': ('Madurai City', 'MATCHED'),
    'nagapattinam': ('Nagapattinam', 'MATCHED'),
    'namakkal': ('Namakkal', 'MATCHED'),
    'perambalur': ('Perambalur', 'MATCHED'),
    'pudukkottai': ('Pudukkottai', 'MATCHED'),
    'salem': ('Salem', 'MATCHED'),
    'salem city': ('Salem City', 'MATCHED'),
    'sivagangai': ('Sivagangai', 'MATCHED'),
    'sivaganga': ('Sivagangai', 'ALIAS'),
    'thanjavur': ('Thanjavur', 'MATCHED'),
    'the nilgiris': ('The Nilgiris', 'MATCHED'),
    'nilgiris': ('The Nilgiris', 'ALIAS'),
    'theni': ('Theni', 'MATCHED'),
    'tiruchirappalli': ('Tiruchirappalli', 'MATCHED'),
    'tiruchirapalli': ('Tiruchirappalli', 'ALIAS'),
    'tiruchirappalli city': ('Tiruchirappalli City', 'MATCHED'),
    'tiruchirapalli city': ('Tiruchirappalli City', 'ALIAS'),
    'tirunelveli': ('Tirunelveli', 'MATCHED'),
    'tirunelveli city': ('Tirunelveli City', 'MATCHED'),
    'tiruppur': ('Tiruppur', 'MATCHED'),
    'tiruppur city': ('Tiruppur City', 'MATCHED'),
    'tiruvallur': ('Tiruvallur', 'MATCHED'),
    'thiruvallur': ('Tiruvallur', 'ALIAS'),
    'tiruvannamalai': ('Tiruvannamalai', 'MATCHED'),
    'thiruvannamalai': ('Tiruvannamalai', 'ALIAS'),
    'tiruvarur': ('Tiruvarur', 'MATCHED'),
    'thiruvarur': ('Tiruvarur', 'ALIAS'),
    'vellore': ('Vellore', 'MATCHED'),
    'villupuram': ('Villupuram', 'MATCHED'),
    'viluppuram': ('Villupuram', 'ALIAS'),
    'virudhunagar': ('Virudhunagar', 'MATCHED'),
    # Post-2018 TN District Bifurcations
    'chengalpattu': ('Chengalpattu', 'HISTORICAL_NAME'),
    'kallakurichi': ('Kallakurichi', 'HISTORICAL_NAME'),
    'ranipet': ('Ranipet', 'HISTORICAL_NAME'),
    'tenkasi': ('Tenkasi', 'HISTORICAL_NAME'),
    'tirupathur': ('Tirupathur', 'HISTORICAL_NAME'),
    'mayiladuthurai': ('Mayiladuthurai', 'HISTORICAL_NAME'),
    # Non-district / Administrative units
    'cyber crime ps': ('Cyber Crime PS', 'NOT_DISTRICT_DATA'),
    'railways': ('Railways', 'NOT_DISTRICT_DATA'),
    'chennai railway': ('Chennai Railway', 'NOT_DISTRICT_DATA'),
    'trichy railway': ('Trichy Railway', 'NOT_DISTRICT_DATA'),
    'total': ('Total', 'NOT_DISTRICT_DATA'),
    'state total': ('State Total', 'NOT_DISTRICT_DATA')
}

# PDF Document Catalog Mapping
DOC_CATALOG = {
    'FILE_047': ('2007cf3a-9d24-4262-8361-8c59303d334e.pdf', 2017, 'NCRB Crime in India 2017'),
    'FILE_130': ('eaf7ba06-4c9f-45e3-bd1a-a652c562511c.pdf', 2018, 'NCRB Crime in India 2018'),
    'FILE_066': ('2ac03f2a-fdc7-43c4-8fbf-47b963e34804.pdf', 2019, 'NCRB Crime in India 2019 Vol 1'),
    'FILE_085': ('2ac03f2a-fdc7-43c4-8fbf-47b963e34804.pdf', 2019, 'NCRB Crime in India 2019 Vol 2'),
    'FILE_094': ('8a8bade6-ce22-4a62-ab77-02a57b287b3d.pdf', 2020, 'NCRB Crime in India 2020'),
    'FILE_116': ('bc01883a-c56f-433e-ba09-19b7b57f940b.pdf', 2021, 'NCRB Crime in India 2021'),
    'FILE_088': ('474d4eed-f4f8-47bb-aab9-a85771cb478a.pdf', 2022, 'NCRB Crime in India 2022'),
    'FILE_143': ('tn_cr_compendium_2023.pdf', 2023, 'Tamil Nadu SCRB Compendium 2023'),
    'FILE_144': ('tn_cr_statistics_2023.pdf', 2023, 'Tamil Nadu SCRB Crime Statistics 2023'),
    'FILE_092': ('68fd1048-0feb-4f06-8a11-5e7d4e1136cf.pdf', 2023, 'TN Non-Crime Document Snippet')
}

def standardize_crime_category(cat_str):
    c = cat_str.upper().strip()
    if c in CANONICAL_CATEGORIES:
        return c, 'EXACT_MATCH', 'Matches canonical category name exactly'
    
    # Specific mappings
    if any(k in c for k in ['CHILD', 'POCSO', 'JUVENILE']):
        return 'CRIME_AGAINST_CHILDREN', 'VALIDATED_MAPPING', 'Sub-head maps to Crime Against Children'
    elif any(k in c for k in ['WOMEN', 'RAPE', 'DOWRY', 'MOLESTATION', 'OUTRAGE']):
        return 'CRIME_AGAINST_WOMEN', 'VALIDATED_MAPPING', 'Sub-head maps to Crime Against Women'
    elif any(k in c for k in ['ECONOMIC', 'CHEATING', 'FORGERY', 'COUNTERFEITING', 'EMBEZZLEMENT']):
        return 'ECONOMIC_OFFENCES', 'VALIDATED_MAPPING', 'Sub-head maps to Economic Offences'
    elif any(k in c for k in ['BURGLARY', 'THEFT', 'DACOITY', 'ROBBERY', 'PROPERTY']):
        return 'PROPERTY_CRIME', 'VALIDATED_MAPPING', 'Sub-head maps to Property Crime'
    elif any(k in c for k in ['MURDER', 'ATTEMPT TO MURDER', 'HOMICIDE', 'KIDNAPPING', 'RIOT', 'VIOLENT', 'ARSON', 'HURT']):
        return 'VIOLENT_CRIME', 'VALIDATED_MAPPING', 'Sub-head maps to Violent Crime'
    elif any(k in c for k in ['OTHER IPC', 'SLL', 'ACTS', 'CYBER', 'ENVIRONMENT']):
        return 'OTHER_IPC_SLL', 'VALIDATED_MAPPING', 'Sub-head maps to Other IPC / SLL'
    elif any(k in c for k in ['TOTAL COGNIZABLE', 'TOTAL IPC', 'TOTAL CRIMES']):
        return 'UNRESOLVED', 'PARTIAL_MATCH', 'Aggregate category covers multiple canonical heads'
    else:
        return 'UNRESOLVED', 'UNRESOLVED', 'Ambiguous or unmapped crime head'

def run_pipeline():
    print("Starting ANVESHA 2015–2023 District PDF Standardization Pipeline...")

    table_files = glob.glob("pdf_extracted_tables/*.csv")
    print(f"Total extracted PDF table CSV files inspected: {len(table_files)}")

    raw_extracted_rows = []
    validated_candidate_rows = []
    unresolved_rows = []

    pdf_tables_found_count = len(table_files)
    district_level_tables_count = 0

    for tf in table_files:
        fname = os.path.basename(tf)
        parts = fname.split('_')
        doc_key = parts[0] + '_' + parts[1]
        
        if doc_key not in DOC_CATALOG:
            continue
        
        source_doc, source_year, doc_title = DOC_CATALOG[doc_key]

        page_num = "UNKNOWN"
        for p in parts:
            if p.startswith('p') and p[1:].isdigit():
                page_num = p[1:]

        try:
            df = pd.read_csv(tf)
            if df.empty:
                continue
        except Exception:
            continue

        str_df = df.astype(str)
        matched_districts_in_table = set()
        for idx, row in str_df.iterrows():
            row_text = ' '.join(row.values).lower()
            for key in GEO_MAP:
                if key in row_text:
                    matched_districts_in_table.add(key)
        
        if len(matched_districts_in_table) < 10:
            continue
        
        district_level_tables_count += 1
        table_title = list(df.columns)[1] if len(df.columns) > 1 else list(df.columns)[0]

        # Save copy of raw extracted table
        out_raw_path = os.path.join(OS_PDF_OUTPUT_DIR, fname)
        df.to_csv(out_raw_path, index=False)

        cols_text = ' '.join([str(c) for c in df.columns]).lower()

        is_rate = 'rate' in cols_text or 'percentage' in cols_text
        is_arrest = 'arrest' in cols_text or 'person' in cols_text or 'apprehended' in cols_text
        is_disposal = 'disposed' in cols_text or 'pendency' in cols_text or 'convicted' in cols_text
        is_victim = 'victim' in cols_text
        is_incident = 'cases reported' in cols_text or 'incidence' in cols_text or 'incidents' in cols_text or 'cases registered' in cols_text or 'registered' in cols_text

        if is_rate:
            measurement_type = 'RATE'
        elif is_arrest:
            measurement_type = 'ARRESTS'
        elif is_disposal:
            measurement_type = 'DISPOSALS'
        elif is_victim:
            measurement_type = 'VICTIMS'
        elif is_incident:
            measurement_type = 'INCIDENT_COUNT'
        else:
            measurement_type = 'OTHER'

        for idx, row in df.iterrows():
            row_str = ' '.join([str(v) for v in row.values]).lower()
            
            found_geo_key = None
            for key in GEO_MAP:
                if key in row_str:
                    found_geo_key = key
                    break

            if not found_geo_key:
                continue

            normalized_name, geo_status = GEO_MAP[found_geo_key]
            
            for col_idx, col_name in enumerate(df.columns[2:], start=2):
                orig_val_str = str(row.iloc[col_idx]).strip() if col_idx < len(row) else ""
                
                clean_val_str = re.sub(r'[^0-9.]', '', orig_val_str)
                try:
                    val = float(clean_val_str) if clean_val_str != "" else np.nan
                except ValueError:
                    val = np.nan

                category_raw = str(col_name)
                canonical_cat, tax_status, tax_reason = standardize_crime_category(category_raw)

                obs_record = {
                    'source_document': source_doc,
                    'document_title': doc_title,
                    'page_number': page_num,
                    'table_title': str(table_title)[:100],
                    'source_year': source_year,
                    'original_geography': found_geo_key,
                    'normalized_geography': normalized_name,
                    'geography_mapping_status': geo_status,
                    'original_category': category_raw[:100],
                    'canonical_category': canonical_cat,
                    'taxonomy_mapping_status': tax_status,
                    'taxonomy_mapping_reason': tax_reason,
                    'measurement_type': measurement_type,
                    'original_value': orig_val_str,
                    'numeric_value': val
                }

                raw_extracted_rows.append(obs_record)

                if (geo_status in ['MATCHED', 'ALIAS']) and \
                   (tax_status in ['EXACT_MATCH', 'VALIDATED_MAPPING']) and \
                   (measurement_type == 'INCIDENT_COUNT') and \
                   (not pd.isna(val)) and (val >= 0):
                    validated_candidate_rows.append(obs_record)
                else:
                    unresolved_rows.append(obs_record)

    df_raw = pd.DataFrame(raw_extracted_rows)
    df_candidate = pd.DataFrame(validated_candidate_rows)
    df_unresolved = pd.DataFrame(unresolved_rows)

    print(f"Total raw observations extracted: {len(df_raw)}")
    print(f"District-level tables identified: {district_level_tables_count}")
    print(f"Validated candidate observations: {len(df_candidate)}")
    print(f"Unresolved / Quarantined observations: {len(df_unresolved)}")

    candidate_parquet_path = os.path.join(OS_CANDIDATE_OUTPUT_DIR, "anvesha_2015_2023_candidate.parquet")
    if not df_candidate.empty:
        df_candidate.to_parquet(candidate_parquet_path, index=False)
        print(f"Saved quarantined candidate dataset to: {candidate_parquet_path}")
    else:
        df_empty_schema = pd.DataFrame(columns=[
            'source_document', 'document_title', 'page_number', 'table_title',
            'source_year', 'original_geography', 'normalized_geography',
            'geography_mapping_status', 'original_category', 'canonical_category',
            'taxonomy_mapping_status', 'taxonomy_mapping_reason',
            'measurement_type', 'original_value', 'numeric_value'
        ])
        df_empty_schema.to_parquet(candidate_parquet_path, index=False)
        print(f"Created candidate dataset placeholder at: {candidate_parquet_path}")

    return {
        'pdf_tables_found': pdf_tables_found_count,
        'district_tables_found': district_level_tables_count,
        'raw_observations': len(df_raw),
        'validated_observations': len(df_candidate),
        'unresolved_observations': len(df_unresolved)
    }

if __name__ == '__main__':
    res = run_pipeline()
    print("Pipeline execution complete:", res)

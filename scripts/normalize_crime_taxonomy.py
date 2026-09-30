#!/usr/bin/env python3
"""
ANVESHA Phase 8 & 9: Crime Taxonomy & Legal Normalization Script
Normalizes raw crime heads and legal sections into canonical taxonomies without inventing mappings.
Generates crime_taxonomy_mapping.csv and legal_taxonomy_mapping.csv.
"""

import os
import json
import pandas as pd
import re

CRIME_TAXONOMY_RULES = [
    (r'MURDER', "Murder", "VIOLENT CRIME", "Homicide", "IPC", "Section 302 / BNS 103"),
    (r'ATTEMPT TO MURDER', "Attempt to Murder", "VIOLENT CRIME", "Attempted Homicide", "IPC", "Section 307 / BNS 109"),
    (r'CULPABLE HOMICIDE', "Culpable Homicide Not Amounting to Murder", "VIOLENT CRIME", "Homicide", "IPC", "Section 304 / BNS 105"),
    (r'RAPE', "Rape", "CRIME AGAINST WOMEN", "Sexual Offence", "IPC", "Section 376 / BNS 64"),
    (r'POCSO', "POCSO Offence", "CRIME AGAINST CHILDREN", "Child Sexual Abuse", "SLL", "POCSO Act 2012"),
    (r'KIDNAPPING', "Kidnapping & Abduction", "HUMAN TRAFFICKING / MISSING", "Abduction", "IPC", "Section 363-373 / BNS 137"),
    (r'DACOITY', "Dacoity", "PROPERTY CRIME", "Grave Property Crime", "IPC", "Section 395 / BNS 310"),
    (r'ROBBERY', "Robbery", "PROPERTY CRIME", "Grave Property Crime", "IPC", "Section 392 / BNS 309"),
    (r'BURGLARY|HOUSE.BREAKING', "Burglary / House Breaking", "PROPERTY CRIME", "Property Trespass", "IPC", "Section 457 / BNS 331"),
    (r'THEFT|AUTO_THEFT', "Theft", "PROPERTY CRIME", "Larceny", "IPC", "Section 379 / BNS 303"),
    (r'CHEATING|FORGERY|FRAUD', "Cheating & Forgery", "ECONOMIC OFFENCES", "Financial Crime", "IPC", "Section 420 / BNS 318"),
    (r'RIOTS|RIOTING', "Rioting", "VIOLENT CRIME", "Public Disorder", "IPC", "Section 147-151 / BNS 189"),
    (r'ARSON', "Arson", "PROPERTY CRIME", "Property Destruction", "IPC", "Section 435-436 / BNS 326"),
    (r'HURT|GRIEVOUS HURT', "Grievous Hurt", "VIOLENT CRIME", "Bodily Injury", "IPC", "Section 323-326 / BNS 115"),
    (r'DOWRY', "Dowry Prohibition / Death", "CRIME AGAINST WOMEN", "Gender Crime", "IPC / SLL", "Section 304B / Dowry Act"),
    (r'CYBER|IT ACT', "Cyber Crime", "CYBERCRIME", "Digital Crime", "SLL", "IT Act 2000"),
    (r'SC_ST|SCHEDULED CASTE|PROTECTION OF CIVIL RIGHTS', "Crimes against SC/ST", "CRIMES AGAINST SC/ST", "Atrocity", "SLL", "SC/ST (PoA) Act 1989"),
    (r'CORRUPTION|ANTI_CORRUP', "Corruption / Prevention of Corruption", "ECONOMIC OFFENCES", "Public Graft", "SLL", "Prevention of Corruption Act"),
    (r'NDPS|DRUGS', "Drug Trafficking / NDPS", "SPECIAL & LOCAL LAWS", "Substance Offence", "SLL", "NDPS Act 1985"),
    (r'ARMS ACT', "Arms Act Violations", "SPECIAL & LOCAL LAWS", "Weapons Offence", "SLL", "Arms Act 1959")
]

def map_crime_taxonomy(raw_name):
    raw_upper = str(raw_name).strip().upper()
    
    for pattern, canonical, cat, subcat, sys_name, sec_name in CRIME_TAXONOMY_RULES:
        if re.search(pattern, raw_upper):
            return canonical, cat, subcat, sys_name, sec_name, 0.95
            
    return raw_name, "OTHER / UNCLASSIFIED", "General Crime", "UNKNOWN", "NULL / UNKNOWN", 0.60

def normalize_all_taxonomies():
    print("Starting ANVESHA Phase 8 & 9: Crime Taxonomy & Legal Normalization...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    crime_tax_entries = []
    legal_tax_entries = []
    seen_crimes = set()
    seen_legals = set()
    
    for item in inventory:
        rel_path = item["relative_path"]
        ext = item["extension"]
        filename = item["filename"]
        
        if ext not in ['.csv', '.xlsx', '.xls', '.parquet', '.txt']:
            continue
            
        try:
            if ext in ['.csv', '.txt']:
                try:
                    df = pd.read_csv(rel_path, nrows=200)
                except Exception:
                    df = pd.read_csv(rel_path, nrows=200, encoding='latin1', on_bad_lines='skip')
            elif ext in ['.xlsx', '.xls']:
                df = pd.read_excel(rel_path, nrows=200)
            elif ext == '.parquet':
                df = pd.read_parquet(rel_path)
            else:
                continue
        except Exception:
            continue

        for col in df.columns:
            col_str = str(col).strip()
            # If col represents a crime head or numerical crime column name
            if any(k in col_str.upper() for k in ['MURDER', 'RAPE', 'CRIME', 'OFFENCE', 'THEFT', 'BURGLARY', 'ROBBERY', 'DACOITY', 'ARSON', 'HURT', 'RIOT', 'CHEATING', 'HEAD', 'ACT', 'SECTION']):
                if col_str not in seen_crimes:
                    seen_crimes.add(col_str)
                    can_name, cat, subcat, sys_name, sec_name, conf = map_crime_taxonomy(col_str)
                    
                    crime_tax_entries.append({
                        "original_crime_name": col_str,
                        "canonical_crime_name": can_name,
                        "crime_category": cat,
                        "crime_subcategory": subcat,
                        "legal_system": sys_name,
                        "legal_section": sec_name,
                        "source_file": filename,
                        "confidence": conf
                    })

            if any(l in col_str.upper() for l in ['IPC', 'SLL', 'ACT', 'SECTION']):
                if col_str not in seen_legals:
                    seen_legals.add(col_str)
                    sys_type = "IPC" if "IPC" in col_str.upper() else ("SLL" if "SLL" in col_str.upper() else "UNKNOWN")
                    legal_tax_entries.append({
                        "raw_section": col_str,
                        "legal_system": sys_type,
                        "section_number": col_str if re.search(r'\d+', col_str) else "NULL / UNKNOWN",
                        "act_name": sys_type,
                        "confidence": 0.85 if sys_type != "UNKNOWN" else 0.50
                    })

    df_crime_tax = pd.DataFrame(crime_tax_entries)
    df_crime_tax.to_csv("crime_taxonomy_mapping.csv", index=False)
    
    df_legal_tax = pd.DataFrame(legal_tax_entries)
    df_legal_tax.to_csv("legal_taxonomy_mapping.csv", index=False)
    
    print(f"Phase 8 & 9 Taxonomy Normalization Complete. Outputs exported to crime_taxonomy_mapping.csv ({len(df_crime_tax):,} records) and legal_taxonomy_mapping.csv ({len(df_legal_tax):,} records).")

if __name__ == "__main__":
    normalize_all_taxonomies()

#!/usr/bin/env python3
"""
ANVESHA Phase 6 & 24: Geographic Normalization Script
Normalizes state, district, city, police district, railway unit, and historical names with Tamil Nadu focus.
Generates geography_mapping.csv.
"""

import os
import json
import pandas as pd
import re

TN_GEOGRAPHY_DICTIONARY = {
    # Capitalization & spelling variants for TN districts
    "ARIYALUR": ("Ariyalur", "Revenue District", "Current", 2007, 2026),
    "CHENGAI": ("Chengalpattu (Historical)", "Historical District", "Historical", 1901, 1997),
    "CHENGALPATTU": ("Chengalpattu", "Revenue District", "Current", 2019, 2026),
    "CHENGALPET": ("Chengalpattu", "Revenue District", "Current", 2019, 2026),
    "CHENNAI": ("Chennai", "Revenue District / City", "Current", 1901, 2026),
    "CHENNAI CITY": ("Chennai City", "City Police Commissionerate", "Current", 1901, 2026),
    "CHENNAI URBAN": ("Chennai City", "City Police Commissionerate", "Current", 1901, 2026),
    "CHENNAI RLY.": ("Chennai Railway Police Unit", "Railway Police District", "Current", 1901, 2026),
    "CHENNAI RAILWAY": ("Chennai Railway Police Unit", "Railway Police District", "Current", 1901, 2026),
    "CHENNAISUBURBAN": ("Chennai Suburban Police", "Historical Commissionerate", "Historical", 2008, 2011),
    "COIMBATORE": ("Coimbatore", "Revenue District", "Current", 1901, 2026),
    "COIMBATORE RURAL": ("Coimbatore Rural", "Rural Police District", "Current", 1901, 2026),
    "COIMBATORE URBAN": ("Coimbatore City", "City Police Commissionerate", "Current", 1990, 2026),
    "COIMBATORE CITY": ("Coimbatore City", "City Police Commissionerate", "Current", 1990, 2026),
    "CUDDALORE": ("Cuddalore", "Revenue District", "Current", 1901, 2026),
    "DHARMAPURI": ("Dharmapuri", "Revenue District", "Current", 1965, 2026),
    "DINDIGUL": ("Dindigul", "Revenue District", "Current", 1985, 2026),
    "ERODE": ("Erode", "Revenue District", "Current", 1979, 2026),
    "KANCHIPURAM": ("Kanchipuram", "Revenue District", "Current", 1997, 2026),
    "KANCHEEPURAM": ("Kanchipuram", "Revenue District", "Current", 1997, 2026),
    "KANYAKUMARI": ("Kanyakumari", "Revenue District", "Current", 1956, 2026),
    "KANYAKUMARI AT NAGERCOIL": ("Kanyakumari", "Revenue District", "Current", 1956, 2026),
    "KARUR": ("Karur", "Revenue District", "Current", 1995, 2026),
    "KRISHNAGIRI": ("Krishnagiri", "Revenue District", "Current", 2004, 2026),
    "MADURAI": ("Madurai", "Revenue District", "Current", 1901, 2026),
    "MADURAI RURAL": ("Madurai Rural", "Rural Police District", "Current", 1901, 2026),
    "MADURAI URBAN": ("Madurai City", "City Police Commissionerate", "Current", 1990, 2026),
    "MADURAI CITY": ("Madurai City", "City Police Commissionerate", "Current", 1990, 2026),
    "NAGAPATTINAM": ("Nagapattinam", "Revenue District", "Current", 1991, 2026),
    "NAMAKKAL": ("Namakkal", "Revenue District", "Current", 1997, 2026),
    "NILGIRIS": ("Nilgiris", "Revenue District", "Current", 1901, 2026),
    "THE NILGIRIS": ("Nilgiris", "Revenue District", "Current", 1901, 2026),
    "PERAMBALUR": ("Perambalur", "Revenue District", "Current", 1995, 2026),
    "PUDUKOTTAI": ("Pudukkottai", "Revenue District", "Current", 1974, 2026),
    "PUDUKKOTTAI": ("Pudukkottai", "Revenue District", "Current", 1974, 2026),
    "RAMNATHAPURAM": ("Ramanathapuram", "Revenue District", "Current", 1910, 2026),
    "RAMANATHAPURAM": ("Ramanathapuram", "Revenue District", "Current", 1910, 2026),
    "SALEM": ("Salem", "Revenue District", "Current", 1901, 2026),
    "SALEM RURAL": ("Salem Rural", "Rural Police District", "Current", 1901, 2026),
    "SALEM URBAN": ("Salem City", "City Police Commissionerate", "Current", 1990, 2026),
    "SALEM CITY": ("Salem City", "City Police Commissionerate", "Current", 1990, 2026),
    "SIVAGANGAI": ("Sivagangai", "Revenue District", "Current", 1985, 2026),
    "SIVAGANGA": ("Sivagangai", "Revenue District", "Current", 1985, 2026),
    "THANJAVUR": ("Thanjavur", "Revenue District", "Current", 1901, 2026),
    "TANJORE": ("Thanjavur", "Revenue District", "Current", 1901, 2026),
    "THENI": ("Theni", "Revenue District", "Current", 1996, 2026),
    "THIRUNELVELI": ("Tirunelveli", "Revenue District", "Current", 1901, 2026),
    "TIRUNELVELI": ("Tirunelveli", "Revenue District", "Current", 1901, 2026),
    "THIRUNELVELI RURAL": ("Tirunelveli Rural", "Rural Police District", "Current", 1901, 2026),
    "THIRUNELVELI URBAN": ("Tirunelveli City", "City Police Commissionerate", "Current", 1997, 2026),
    "TIRUNELVELI CITY": ("Tirunelveli City", "City Police Commissionerate", "Current", 1997, 2026),
    "THIRUVALLUR": ("Tiruvallur", "Revenue District", "Current", 1997, 2026),
    "TIRUVALLUR": ("Tiruvallur", "Revenue District", "Current", 1997, 2026),
    "THIRUVANNAMALAI": ("Tiruvannamalai", "Revenue District", "Current", 1989, 2026),
    "TIRUVANNAMALAI": ("Tiruvannamalai", "Revenue District", "Current", 1989, 2026),
    "THIRUVARUR": ("Tiruvarur", "Revenue District", "Current", 1991, 2026),
    "TIRUVARUR": ("Tiruvarur", "Revenue District", "Current", 1991, 2026),
    "TUTICORIN": ("Thoothukudi", "Revenue District", "Current", 1986, 2026),
    "THOOTHUKUDI": ("Thoothukudi", "Revenue District", "Current", 1986, 2026),
    "TRICHY": ("Tiruchirappalli", "Revenue District", "Current", 1901, 2026),
    "TRICHY RURAL": ("Tiruchirappalli Rural", "Rural Police District", "Current", 1901, 2026),
    "TRICHY URBAN": ("Tiruchirappalli City", "City Police Commissionerate", "Current", 1997, 2026),
    "TRICHY RLY.": ("Tiruchirappalli Railway Police Unit", "Railway Police District", "Current", 1901, 2026),
    "TIRUCHIRAPPALLI": ("Tiruchirappalli", "Revenue District", "Current", 1901, 2026),
    "TIRUPPUR": ("Tiruppur", "Revenue District", "Current", 2009, 2026),
    "TIRUPUR": ("Tiruppur", "Revenue District", "Current", 2009, 2026),
    "VELLORE": ("Vellore", "Revenue District", "Current", 1901, 2026),
    "VILLUPURAM": ("Viluppuram", "Revenue District", "Current", 1993, 2026),
    "VILUPPURAM": ("Viluppuram", "Revenue District", "Current", 1993, 2026),
    "VIRUDHUNAGAR": ("Virudhunagar", "Revenue District", "Current", 1985, 2026),
    "TENKASI": ("Tenkasi", "Revenue District", "Current", 2019, 2026),
    "KALLAKURICHI": ("Kallakurichi", "Revenue District", "Current", 2019, 2026),
    "RANIPET": ("Ranipet", "Revenue District", "Current", 2019, 2026),
    "TIRUPATTUR": ("Tirupattur", "Revenue District", "Current", 2019, 2026),
    "MAYILADUTHURAI": ("Mayiladuthurai", "Revenue District", "Current", 2020, 2026),
    "AVADI": ("Avadi City", "City Police Commissionerate", "Current", 2021, 2026),
    "TAMBARAM": ("Tambaram City", "City Police Commissionerate", "Current", 2021, 2026)
}

def normalize_all_geography():
    print("Starting ANVESHA Phase 6 & 24: Geographic Normalization...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    geo_mappings = []
    seen_names = set()
    
    for item in inventory:
        rel_path = item["relative_path"]
        ext = item["extension"]
        
        if ext not in ['.csv', '.xlsx', '.xls', '.parquet', '.txt']:
            continue
            
        try:
            if ext in ['.csv', '.txt']:
                try:
                    df = pd.read_csv(rel_path, nrows=500)
                except Exception:
                    df = pd.read_csv(rel_path, nrows=500, encoding='latin1', on_bad_lines='skip')
            elif ext in ['.xlsx', '.xls']:
                df = pd.read_excel(rel_path, nrows=500)
            elif ext == '.parquet':
                df = pd.read_parquet(rel_path)
            else:
                continue
        except Exception:
            continue

        state_col = None
        dist_col = None
        for col in df.columns:
            if any(s in str(col).upper() for s in ['STATE', 'ST_NAME', 'UT']):
                state_col = col
            if any(d in str(col).upper() for d in ['DISTRICT', 'DIST', 'CITY', 'UNIT']):
                dist_col = col

        if dist_col and dist_col in df.columns:
            for orig_name in df[dist_col].dropna().unique():
                raw_str = str(orig_name).strip()
                if not raw_str or raw_str in seen_names or raw_str.upper() in ['TOTAL', 'TOTAL (STATE)', 'SUB TOTAL', 'ZZ TOTAL']:
                    continue
                seen_names.add(raw_str)
                
                raw_clean = raw_str.upper()
                state_val = "Tamil Nadu" if item["detected_state"] == "Tamil Nadu" else "India"
                
                if raw_clean in TN_GEOGRAPHY_DICTIONARY:
                    norm_name, hist_type, status, v_from, v_to = TN_GEOGRAPHY_DICTIONARY[raw_clean]
                    geo_mappings.append({
                        "original_name": raw_str,
                        "normalized_name": norm_name,
                        "state": state_val,
                        "district": norm_name,
                        "city": norm_name if "City" in norm_name or "Urban" in norm_name else "N/A",
                        "historical_name": raw_str if status == "Historical" else "N/A",
                        "valid_from": v_from,
                        "valid_to": v_to,
                        "mapping_reason": f"Matched TN dictionary entry ({hist_type})",
                        "confidence": 1.0
                    })
                else:
                    # Generic Title Case normalization
                    norm_title = raw_str.title()
                    geo_mappings.append({
                        "original_name": raw_str,
                        "normalized_name": norm_title,
                        "state": state_val,
                        "district": norm_title,
                        "city": "N/A",
                        "historical_name": "N/A",
                        "valid_from": 2001,
                        "valid_to": 2026,
                        "mapping_reason": "Standard title-casing",
                        "confidence": 0.85
                    })

    df_geo = pd.DataFrame(geo_mappings)
    df_geo.to_csv("geography_mapping.csv", index=False)
    print(f"Phase 6 & 24 Geographic Normalization Complete. Output exported to geography_mapping.csv ({len(df_geo):,} entries mapped).")

if __name__ == "__main__":
    normalize_all_geography()

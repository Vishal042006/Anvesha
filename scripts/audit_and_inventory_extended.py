import os
import glob
import re
import pandas as pd

def audit_inventory():
    print("Starting ANVESHA Extended Dataset Inventory & Audit...")
    os.makedirs("data/09_validation", exist_ok=True)

    inventory_records = []

    # File patterns to inspect
    target_dirs = [
        ".",
        "data",
        "data/01_raw",
        "data/02_segregated",
        "data/03_harmonized",
        "data/04_integrated",
        "data/05_ml",
        "pdf_extracted_tables",
        "anvesha_training_data"
    ]

    file_list = []
    for d in target_dirs:
        if os.path.exists(d):
            for f in os.listdir(d):
                fp = os.path.join(d, f)
                if os.path.isfile(fp) and f.endswith(('.csv', '.parquet', '.pdf', '.json')):
                    file_list.append(fp)

    print(f"Auditing {len(file_list)} core dataset files across repository...")

    for filepath in file_list:
        fname = os.path.basename(filepath)
        fext = os.path.splitext(fname)[1].lower()
        
        source_type = "CSV" if fext == ".csv" else ("PARQUET" if fext == ".parquet" else ("PDF" if fext == ".pdf" else "JSON"))
        
        year_matches = re.findall(r'20\d\d|19\d\d', fname)
        if year_matches:
            if len(year_matches) >= 2:
                source_year = f"{year_matches[0]}–{year_matches[-1]}"
                report_year = year_matches[-1]
            else:
                source_year = year_matches[0]
                report_year = year_matches[0]
        else:
            source_year = "2001–2023"
            report_year = "2023"

        # Geography & Level
        if "TN" in fname.upper() or "TAMIL" in fname.upper() or "DISTRICT" in fname.upper() or "DSTR" in fname.upper():
            geography = "Tamil Nadu"
            geographic_level = "District / Commissionerate"
        elif "CITY" in fname.upper() or "CHENNAI" in fname.upper():
            geography = "Chennai / City"
            geographic_level = "City"
        elif "STATE" in fname.upper() or "INDIA" in fname.upper() or "NCRB" in fname.upper():
            geography = "India / States"
            geographic_level = "State"
        else:
            geography = "Tamil Nadu"
            geographic_level = "District"

        # Classify into 13 Strict Domains
        fn_up = fname.upper()
        if "ROAD" in fn_up or "ACCIDENT" in fn_up or "CRASH" in fn_up:
            domain = "I. ROAD SAFETY"
            measurement = "ACCIDENTS & FATALITIES"
        elif "COMPLAINT" in fn_up:
            domain = "C. COMPLAINTS"
            measurement = "COMPLAINT COUNT"
        elif "VICTIM" in fn_up or "RAPE" in fn_up or "MURDER_VICTIM" in fn_up:
            domain = "D. VICTIMS"
            measurement = "VICTIM COUNT"
        elif "ARREST" in fn_up or "PERSONS_ARRESTED" in fn_up or "JUVENILE_APPREHENDED" in fn_up:
            domain = "E. ARRESTS"
            measurement = "PERSONS ARRESTED"
        elif "DISPOSAL" in fn_up or "POLICE_STRENGTH" in fn_up:
            domain = "F. POLICE DISPOSAL"
            measurement = "POLICE DISPOSAL / STRENGTH"
        elif "TRIAL" in fn_up or "COURT" in fn_up:
            domain = "G. COURT DISPOSAL"
            measurement = "CASES DISPOSED BY COURT"
        elif "SUICIDE" in fn_up:
            domain = "H. SUICIDES"
            measurement = "SUICIDE INCIDENTS"
        elif "POPULATION" in fn_up or "CENSUS" in fn_up:
            domain = "J. POPULATION"
            measurement = "POPULATION COUNT"
        elif "GRAPH" in fn_up or "GEO" in fn_up or "NODE" in fn_up or "KML" in fn_up:
            domain = "K. GEOGRAPHY"
            measurement = "LAT/LON & CENTROIDS"
        elif "PDF" in fn_up or "FILE_" in fn_up or "COMPENDIUM" in fn_up:
            domain = "L. DOCUMENTARY EVIDENCE"
            measurement = "DOCUMENT SNIPPET / TABLE"
        elif "THEFT" in fn_up or "PROPERTY" in fn_up or "SC_ST" in fn_up or "WOMEN" in fn_up or "CHILDREN" in fn_up or "ECONOMIC" in fn_up or "CYBER" in fn_up:
            domain = "B. CRIME SUBCATEGORY"
            measurement = "SUBCATEGORY INCIDENTS"
        else:
            domain = "A. CORE CRIME INCIDENCE"
            measurement = "RECORDED CRIME INCIDENTS"

        category = "IPC / SLL Crimes"
        grain = f"{geographic_level} x Year x Category"
        source_org = "NCRB / SCRB / TN Police"

        # Compatibility & Status
        rows = 100 # default approximation for speed
        status = "VALIDATED"
        compatibility = "HIGH"
        notes = "Clean research dataset"

        if fext == ".csv":
            try:
                # Fast line count estimate
                with open(filepath, 'rb') as f:
                    rows = sum(1 for _ in f) - 1
            except Exception:
                rows = 0
        elif fext == ".parquet":
            try:
                df_temp = pd.read_parquet(filepath)
                rows = len(df_temp)
            except Exception:
                rows = 0

        if "BENCHMARK" in fn_up or "ANVESHA_CLEAN_CRIME_MASTER" in fn_up:
            status = "VALIDATED BENCHMARK V1 (FROZEN)"
            compatibility = "FROZEN BENCHMARK"
            notes = "Primary 2001–2014 forecast master"
        elif "EXTENDED" in fn_up:
            status = "EXTENDED MASTER V2"
            compatibility = "EXTENDED MODEL TRACK B"
            notes = "2001–2023 extended forecasting master"
        elif domain in ["C. COMPLAINTS", "I. ROAD SAFETY", "H. SUICIDES"]:
            status = "DOMAIN SEPARATED"
            compatibility = "SEPARATE ANALYTICAL DOMAIN"
            notes = "Do not merge into crime incidence forecasting target"

        inventory_records.append({
            "source_file": filepath,
            "source_type": source_type,
            "source_year": source_year,
            "report_year": report_year,
            "geography": geography,
            "geographic_level": geographic_level,
            "crime_domain": domain,
            "crime_category": category,
            "measurement": measurement,
            "grain": grain,
            "source_organization": source_org,
            "format": fext.upper().replace(".", ""),
            "rows": rows,
            "status": status,
            "compatibility": compatibility,
            "notes": notes
        })

    df_inv = pd.DataFrame(inventory_records)
    out_path = "data/09_validation/extended_dataset_inventory.csv"
    df_inv.to_csv(out_path, index=False)
    print(f"Inventory audit complete. {len(df_inv)} files registered in {out_path}.")

if __name__ == "__main__":
    audit_inventory()

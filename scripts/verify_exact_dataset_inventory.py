import os
import pandas as pd
import json

def classify_and_verify_inventory():
    print("Running Rigorous File & Content Inspection across ANVESHA Repository...")

    ignore_dirs = {'.git', 'node_modules', '.venv', 'venv', '__pycache__', 'build', 'dist', '.pytest_cache'}
    valid_exts = {'.csv', '.tsv', '.parquet', '.xlsx', '.xls', '.json', '.jsonl', '.kml', '.kmz', '.pdf'}

    inventory = []

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext not in valid_exts:
                continue

            filepath = os.path.normpath(os.path.join(root, file))
            size_bytes = os.path.getsize(filepath)
            rel_path = filepath.lower()

            domain = "RESEARCH_METADATA"
            file_class = "Reference & Research Metadata"
            source_org = "State Crime Records Bureau / NCRB / Govt of TN"
            row_count = None
            col_count = None
            year_start = None
            year_end = None
            status = "valid"
            is_primary = False

            # Check if file is in metadata/profile directories
            if any(p in rel_path for p in ['dataset_profiles', 'pdf_metadata', 'pdf_extracted_text', 'feature_registry', 'quality_report', 'split_integrity', 'training_manifest']):
                domain = "RESEARCH_METADATA"
                file_class = "Dataset Profile / Metadata Schema"
                is_primary = False
            elif ext == '.pdf':
                domain = "DOCUMENTARY_EVIDENCE"
                file_class = "Annual Official Report PDF"
                is_primary = True
            elif ext in ('.kml', '.kmz'):
                domain = "POLICE_STATIONS"
                file_class = "Spatial Jurisdiction KML"
                is_primary = True
            else:
                # Tabular Inspection
                try:
                    cols = []
                    if ext == '.parquet':
                        df_tmp = pd.read_parquet(filepath)
                        row_count = len(df_tmp)
                        col_count = len(df_tmp.columns)
                        cols = [c.lower() for c in df_tmp.columns]
                    elif ext in ('.csv', '.tsv'):
                        sep = '\t' if ext == '.tsv' else ','
                        df_head = pd.read_csv(filepath, sep=sep, nrows=5, low_memory=False)
                        col_count = len(df_head.columns)
                        cols = [c.lower() for c in df_head.columns]
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            row_count = max(0, sum(1 for _ in f) - 1)
                    
                    cols_str = " ".join(cols)
                    file_str = (rel_path + " " + cols_str).lower()

                    # Domain classification based on content + filename
                    if "road" in file_str or "accident" in file_str or "crash" in file_str:
                        domain = "ROAD_SAFETY"
                        file_class = "Traffic Crash Statistics"
                        is_primary = True
                    elif "complaint" in file_str:
                        domain = "COMPLAINTS"
                        file_class = "Public Complaints Received"
                        is_primary = True
                    elif "suicide" in file_str:
                        domain = "SUICIDES"
                        file_class = "Mortality & Social Indicators"
                        is_primary = True
                    elif "sc_st" in file_str or "against_sc" in file_str or "against_st" in file_str or "crimes_committed_against_sc" in file_str or "crimes_committed_against_st" in file_str:
                        domain = "SC_ST_CRIME"
                        file_class = "Crimes Against SC/ST"
                        is_primary = True
                    elif "women" in file_str or "rape" in file_str or "dowry" in file_str:
                        domain = "CRIMES_AGAINST_WOMEN"
                        file_class = "Crimes Against Women"
                        is_primary = True
                    elif "children" in file_str or "juvenile" in file_str or "pocso" in file_str:
                        domain = "CRIMES_AGAINST_CHILDREN"
                        file_class = "Crimes Against Children"
                        is_primary = True
                    elif "cyber" in file_str or "it_act" in file_str:
                        domain = "CYBER_CRIME"
                        file_class = "Cyber Offences"
                        is_primary = True
                    elif "economic" in file_str or "fraud" in file_str or "counterfeit" in file_str:
                        domain = "ECONOMIC_CRIME"
                        file_class = "Economic & Financial Offences"
                        is_primary = True
                    elif "murder" in file_str or "homicide" in file_str or "negligence" in file_str:
                        domain = "DEATHS"
                        file_class = "Homicide & Violent Mortality"
                        is_primary = True
                    elif "police_station" in file_str or "jurisdiction" in file_str:
                        domain = "POLICE_STATIONS"
                        file_class = "Police Station Directory"
                        is_primary = True
                    elif "population" in file_str or "census" in file_str:
                        domain = "POPULATION"
                        file_class = "Demographic Context"
                        is_primary = True
                    elif "dim_geography" in file_str or "geography_mapping" in file_str:
                        domain = "GEOGRAPHY"
                        file_class = "Administrative Units Directory"
                        is_primary = True
                    elif "pdf_extracted_tables" in rel_path:
                        domain = "PDF_EXTRACTED_TABLES"
                        file_class = "PDF Statistical Table Chunk"
                        is_primary = False
                    elif "ipc" in file_str or "core" in file_str or "master" in file_str or "cognizable" in file_str or "dstripc" in file_str:
                        domain = "CORE_CRIME"
                        file_class = "FIR Cognizable Offences"
                        is_primary = True

                    if 'year' in cols and ext == '.parquet':
                        year_start = int(df_tmp['year'].min())
                        year_end = int(df_tmp['year'].max())

                except Exception as e:
                    status = "invalid"

            inventory.append({
                "filepath": filepath,
                "filename": file,
                "extension": ext.upper(),
                "domain": domain,
                "class": file_class,
                "is_primary": is_primary,
                "row_count": row_count,
                "col_count": col_count,
                "size_bytes": size_bytes,
                "status": status
            })

    df_all = pd.DataFrame(inventory)
    
    # Save full inventory CSV
    df_all.to_csv("reports/anvesha_dataset_inventory_verified.csv", index=False)

    print("\n=== VERIFIED DOMAIN SEGREGATION SUMMARY ===")
    domain_summary = []
    for dom, group in df_all.groupby("domain"):
        primary_cnt = group['is_primary'].sum()
        total_cnt = len(group)
        valid_cnt = (group['status'] == 'valid').sum()
        total_rows = group['row_count'].dropna().sum()
        domain_summary.append({
            "domain": dom,
            "primary_source_datasets": int(primary_cnt),
            "total_files_in_domain": int(total_cnt),
            "valid_files": int(valid_cnt),
            "total_measured_rows": int(total_rows) if total_rows > 0 else 0
        })

    df_sum = pd.DataFrame(domain_summary).sort_values("primary_source_datasets", ascending=False)
    print(df_sum.to_string(index=False))
    
    df_sum.to_csv("reports/anvesha_domain_verified_summary.csv", index=False)
    
    print(f"\nTOTAL ALL FILES: {len(df_all)}")
    print(f"PRIMARY SOURCE DATASETS: {df_all['is_primary'].sum()}")
    print(f"TOTAL ROWS: {df_all['row_count'].dropna().sum():,}")

if __name__ == "__main__":
    classify_and_verify_inventory()

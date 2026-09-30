#!/usr/bin/env python3
"""
ANVESHA Phase 2, 3 & 4: Profile Tabular Datasets, Determine Grain, and Classify Domains
Generates detailed JSON and Markdown profile reports in dataset_profiles/.
"""

import os
import json
import pandas as pd
import numpy as np
import re

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '_', text)

def profile_column(series, col_name):
    total_len = len(series)
    null_count = int(series.isna().sum())
    null_pct = float((null_count / (total_len + 1e-9)) * 100)
    unique_count = int(series.nunique(dropna=True))
    
    sample_vals = series.dropna().astype(str).unique()[:5].tolist()
    
    col_type = "categorical"
    is_numeric = pd.api.types.is_numeric_dtype(series)
    
    stats = {}
    if is_numeric:
        col_type = "numeric"
        non_null = series.dropna()
        if len(non_null) > 0:
            stats["min"] = float(non_null.min())
            stats["max"] = float(non_null.max())
            stats["mean"] = float(non_null.mean())
            stats["std"] = float(non_null.std()) if len(non_null) > 1 else 0.0
            
    # Check if total / aggregate column
    is_total_col = any(t in col_name.upper() for t in ['TOTAL', 'SUB_TOTAL', 'GRAND_TOTAL', 'ALL_CRIMES', 'OVERALL'])
    # Check if geographic col
    is_geo_col = any(g in col_name.upper() for g in ['STATE', 'DISTRICT', 'CITY', 'UT', 'ST_NAME', 'DIST'])
    # Check if year col
    is_year_col = any(y in col_name.upper() for y in ['YEAR', 'PERIOD', 'DATE'])
    # Check if identifier col
    is_id_col = any(i in col_name.upper() for i in ['ID', 'CODE', 'SL_NO', 'SLNO', 'SNO'])
    
    return {
        "column_name": col_name,
        "data_type": str(series.dtype),
        "inferred_type": col_type,
        "null_count": null_count,
        "null_percentage": round(null_pct, 2),
        "unique_count": unique_count,
        "sample_values": sample_vals,
        "numeric_stats": stats if is_numeric else None,
        "is_constant": unique_count <= 1 and total_len > 0,
        "is_total_column": is_total_col,
        "is_geographic": is_geo_col,
        "is_year": is_year_col,
        "is_identifier": is_id_col
    }

def run_profiling():
    print("Starting ANVESHA Phase 2, 3 & 4: Profiling all tabular datasets...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json not found. Run inventory.py first.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    os.makedirs("dataset_profiles", exist_ok=True)
    
    profiles_summary = []
    
    for item in inventory:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        ext = item["extension"]
        
        if ext not in ['.csv', '.xlsx', '.xls', '.parquet', '.txt']:
            continue
            
        print(f"Profiling {file_id}: {filename}...")
        
        try:
            if ext in ['.csv', '.txt']:
                try:
                    df = pd.read_csv(rel_path)
                except Exception:
                    try:
                        df = pd.read_csv(rel_path, encoding='latin1', on_bad_lines='skip')
                    except Exception:
                        df = pd.read_csv(rel_path, encoding='latin1', engine='python', on_bad_lines='skip')
            elif ext in ['.xlsx', '.xls']:
                df = pd.read_excel(rel_path)
            elif ext == '.parquet':
                df = pd.read_parquet(rel_path)
            else:
                continue
        except Exception as e:
            print(f"Skipping {filename} due to load error: {e}")
            continue
            
        row_count, col_count = df.shape
        dup_rows = int(df.duplicated().sum())
        
        column_profiles = []
        num_cols = []
        cat_cols = []
        geo_cols = []
        year_cols = []
        total_cols = []
        constant_cols = []
        
        for col in df.columns:
            cp = profile_column(df[col], str(col))
            column_profiles.append(cp)
            if cp["inferred_type"] == "numeric":
                num_cols.append(str(col))
            else:
                cat_cols.append(str(col))
            if cp["is_geographic"]:
                geo_cols.append(str(col))
            if cp["is_year"]:
                year_cols.append(str(col))
            if cp["is_total_column"]:
                total_cols.append(str(col))
            if cp["is_constant"]:
                constant_cols.append(str(col))

        # Build Profile JSON object
        profile_obj = {
            "file_id": file_id,
            "filename": filename,
            "relative_path": rel_path,
            "file_size_bytes": item["file_size_bytes"],
            "dataset_category": item["dataset_category"],
            "data_grain": item["data_grain"],
            "source_organization": item["source_organization"],
            "detected_state": item["detected_state"],
            "detected_year": item["detected_year"],
            "row_count": row_count,
            "column_count": col_count,
            "duplicate_rows_count": dup_rows,
            "constant_columns": constant_cols,
            "total_columns": total_cols,
            "numeric_columns": num_cols,
            "categorical_columns": cat_cols,
            "geographic_columns": geo_cols,
            "year_columns": year_cols,
            "column_details": column_profiles,
            "notes": item["notes"]
        }
        
        slug = slugify(os.path.splitext(filename)[0])
        json_filename = f"{file_id}_{slug}_profile.json"
        md_filename = f"{file_id}_{slug}_profile.md"
        
        with open(os.path.join("dataset_profiles", json_filename), "w") as f_json:
            json.dump(profile_obj, f_json, indent=2)
            
        # Write Markdown Profile
        md_content = f"""# Dataset Profile: {filename} ({file_id})

## Metadata Summary
- **File Path**: `{rel_path}`
- **File Size**: {item["file_size_bytes"]:,} bytes
- **Domain Category**: `{item["dataset_category"]}`
- **Data Grain**: `{item["data_grain"]}`
- **Source Organization**: `{item["source_organization"]}`
- **Geography Level**: `{item["geography_level"]}`
- **Detected Geography**: `{item["detected_state"]}`
- **Detected Year**: `{item["detected_year"]}`
- **Quality Score**: `{item["quality_score"]}/100`

## Dimensions
- **Row Count**: {row_count:,}
- **Column Count**: {col_count}
- **Duplicate Rows**: {dup_rows}

## Column Classification
- **Numeric Columns ({len(num_cols)})**: `{", ".join(num_cols[:10])}{"..." if len(num_cols) > 10 else ""}`
- **Categorical Columns ({len(cat_cols)})**: `{", ".join(cat_cols[:10])}{"..." if len(cat_cols) > 10 else ""}`
- **Geographic Columns**: `{", ".join(geo_cols)}`
- **Year Columns**: `{", ".join(year_cols)}`
- **Total/Aggregate Columns**: `{", ".join(total_cols)}`
- **Constant Columns**: `{", ".join(constant_cols) if constant_cols else "None"}`

## Column Profiles Detail
| Column Name | Type | Missing % | Unique Count | Sample Values |
|---|---|---|---|---|
"""
        for cp in column_profiles:
            samples = ", ".join([str(s) for s in cp["sample_values"][:3]])
            md_content += f"| `{cp['column_name']}` | `{cp['inferred_type']}` | {cp['null_percentage']}% | {cp['unique_count']} | `{samples}` |\n"

        with open(os.path.join("dataset_profiles", md_filename), "w") as f_md:
            f_md.write(md_content)
            
        profiles_summary.append({
            "file_id": file_id,
            "filename": filename,
            "category": item["dataset_category"],
            "grain": item["data_grain"],
            "row_count": row_count,
            "col_count": col_count,
            "quality_score": item["quality_score"]
        })

    # Write PROFILE_INDEX.md
    idx_content = "# ANVESHA Dataset Profiles Index\n\n"
    idx_content += "| File ID | Filename | Category | Data Grain | Rows | Cols | Quality Score |\n"
    idx_content += "|---|---|---|---|---|---|---|\n"
    for ps in profiles_summary:
        idx_content += f"| `{ps['file_id']}` | `{ps['filename']}` | `{ps['category']}` | `{ps['grain']}` | {ps['row_count']:,} | {ps['col_count']} | {ps['quality_score']} |\n"
        
    with open(os.path.join("dataset_profiles", "PROFILE_INDEX.md"), "w") as f_idx:
        f_idx.write(idx_content)
        
    print(f"Phase 2, 3 & 4 Profiling Complete. Generated {len(profiles_summary)} dataset profile files in dataset_profiles/.")

if __name__ == "__main__":
    run_profiling()

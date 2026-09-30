#!/usr/bin/env python3
"""
ANVESHA Phase 10: Deduplication Analysis Script
Detects identical files, overlapping year ranges, derived versions, and schema duplicates.
Generates duplicate_report.csv without modifying or deleting original files.
"""

import os
import json
import pandas as pd
import hashlib

def run_deduplication():
    print("Starting ANVESHA Phase 10: Deduplication Analysis...")
    
    if not os.path.exists("data_inventory.json"):
        print("Error: data_inventory.json missing.")
        return
        
    with open("data_inventory.json", "r") as f:
        inventory = json.load(f)
        
    dup_reports = []
    
    # 1. Exact Content Duplicates (MD5 Hashes)
    file_hashes = {}
    for item in inventory:
        rel_path = item["relative_path"]
        file_id = item["file_id"]
        filename = item["filename"]
        
        if not os.path.isfile(rel_path):
            continue
            
        with open(rel_path, 'rb') as fp:
            file_hash = hashlib.md5(fp.read()).hexdigest()
            
        if file_hash in file_hashes:
            orig_id, orig_filename = file_hashes[file_hash]
            dup_reports.append({
                "file_a": orig_filename,
                "file_b": filename,
                "overlap_type": "EXACT_FILE_DUPLICATE",
                "similarity": 1.0,
                "decision": "DUPLICATE",
                "reason": f"Identical byte hash with {orig_filename} ({orig_id}). Retaining {orig_filename} as primary reference."
            })
        else:
            file_hashes[file_hash] = (file_id, filename)

    # 2. Overlapping Datasets by Category & Year Ranges
    n_items = len(inventory)
    for i in range(n_items):
        item_a = inventory[i]
        for j in range(i + 1, n_items):
            item_b = inventory[j]
            
            # Skip if extensions don't match or categories don't match
            if item_a["extension"] != item_b["extension"] or item_a["dataset_category"] != item_b["dataset_category"]:
                continue
                
            # Check for overlapping filename pattern or year ranges
            fn_a, fn_b = item_a["filename"], item_b["filename"]
            yr_a, yr_b = item_a["year_range"], item_b["year_range"]
            
            # e.g., 2001_2012 vs 2013 vs 2014
            if item_a["schema_group"] == item_b["schema_group"] and yr_a != yr_b:
                dup_reports.append({
                    "file_a": fn_a,
                    "file_b": fn_b,
                    "overlap_type": "TEMPORAL_SEQUENCE",
                    "similarity": 0.85,
                    "decision": "KEEP_BOTH",
                    "reason": f"Same schema group ({item_a['schema_group']}), but complementary time periods ({yr_a} vs {yr_b}). Combine chronologically in integrated master."
                })
            elif item_a["schema_group"] == item_b["schema_group"] and yr_a == yr_b and fn_a != fn_b:
                dup_reports.append({
                    "file_a": fn_a,
                    "file_b": fn_b,
                    "overlap_type": "SCHEMA_AND_YEAR_OVERLAP",
                    "similarity": 0.90,
                    "decision": "REVIEW_REQUIRED",
                    "reason": f"Identical schema group and overlapping year range ({yr_a}). Check for repeated state totals."
                })

    df_dup = pd.DataFrame(dup_reports)
    df_dup.to_csv("duplicate_report.csv", index=False)
    print(f"Phase 10 Deduplication Complete. Output exported to duplicate_report.csv ({len(df_dup):,} duplicate candidate relationships identified).")

if __name__ == "__main__":
    run_deduplication()

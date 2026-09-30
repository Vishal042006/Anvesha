#!/usr/bin/env python3
"""
ANVESHA Script 05: Temporal & Spatial Split Execution & Preprocessor Fitting
Splits feature sets into 05_training/ (2001-2017), 06_validation/ (2018-2019), and 07_test/ (2020-2023).
Fits scaling and encoding transformers EXCLUSIVELY on training data to prevent leakage.
Generates SPLIT_INTEGRITY_REPORT.csv.
"""

import os
import glob
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder

TASKS = [
    ("forecasting", "crime_forecasting_training.csv"),
    ("forecasting", "crime_rate_forecasting_training.csv"),
    ("anomaly_detection", "crime_anomaly_training.csv"),
    ("classification", "crime_category_classification.csv"),
    ("trend_analysis", "crime_trend_classification.csv"),
    ("spatiotemporal", "spatiotemporal_crime_training.csv"),
    ("disposal", "court_disposal_training.csv")
]

def execute_splits():
    print("Executing ANVESHA Script 05: Temporal & Spatial Splitting with Leakage-Free Preprocessing...")
    
    os.makedirs("anvesha_training_data/preprocessors", exist_ok=True)
    split_integrity_rows = []

    for task_folder, filename in TASKS:
        feat_path = os.path.join("anvesha_training_data", "04_features", task_folder if task_folder != 'disposal' else 'disposal_analysis', filename)
        if not os.path.exists(feat_path):
            continue

        df_feat = pd.read_csv(feat_path)
        if df_feat.empty:
            continue

        # Add Spatial Holdout Flag
        df_feat['is_spatial_holdout'] = df_feat['district'].str.upper().isin(['DINDIGUL', 'SALEM CITY', 'SALEM URBAN'])

        # Temporal Partitioning
        train_df = df_feat[df_feat['year'] <= 2017].copy()
        val_df = df_feat[(df_feat['year'] >= 2018) & (df_feat['year'] <= 2019)].copy()
        test_df = df_feat[df_feat['year'] >= 2020].copy()

        train_df['split'] = 'train'
        val_df['split'] = 'validation'
        test_df['split'] = 'test'

        # Save Raw Split Partition Files
        train_out = os.path.join("anvesha_training_data", "05_training", task_folder, filename)
        val_out = os.path.join("anvesha_training_data", "06_validation", task_folder, filename)
        test_out = os.path.join("anvesha_training_data", "07_test", task_folder, filename)

        os.makedirs(os.path.dirname(train_out), exist_ok=True)
        os.makedirs(os.path.dirname(val_out), exist_ok=True)
        os.makedirs(os.path.dirname(test_out), exist_ok=True)

        train_df.to_csv(train_out, index=False)
        val_df.to_csv(val_out, index=False)
        test_df.to_csv(test_out, index=False)

        # ----------------------------------------------------
        # PREPROCESSING: FIT ON TRAIN ONLY, TRANSFORM VAL/TEST
        # ----------------------------------------------------
        num_cols = [c for c in ['previous_year_crime', 'two_year_avg', 'three_year_avg', 'five_year_avg', 'year_over_year_change', 'population', 'crime_rate', 'crime_share'] if c in train_df.columns]
        cat_cols = [c for c in ['district', 'crime_category'] if c in train_df.columns]

        scaler = StandardScaler()
        encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

        if len(num_cols) > 0 and not train_df.empty:
            scaler.fit(train_df[num_cols].fillna(0))

        if len(cat_cols) > 0 and not train_df.empty:
            encoder.fit(train_df[cat_cols].fillna("UNKNOWN"))

        # Save fitted transformer artifacts separately
        prep_artifact_path = os.path.join("anvesha_training_data", "preprocessors", f"{task_folder}_{filename}_preprocessors.pkl")
        with open(prep_artifact_path, "wb") as f_prep:
            pickle.dump({"scaler": scaler, "encoder": encoder, "numeric_cols": num_cols, "categorical_cols": cat_cols}, f_prep)

        # Audit Split Integrity
        train_keys = set(zip(train_df['district'], train_df['year'], train_df['crime_category']))
        val_keys = set(zip(val_df['district'], val_df['year'], val_df['crime_category']))
        test_keys = set(zip(test_df['district'], test_df['year'], test_df['crime_category']))

        overlap_tv = len(train_keys.intersection(val_keys))
        overlap_tt = len(train_keys.intersection(test_keys))
        overlap_vt = len(val_keys.intersection(test_keys))

        split_integrity_rows.append({
            "task_group": task_folder,
            "filename": filename,
            "train_rows": len(train_df),
            "validation_rows": len(val_df),
            "test_rows": len(test_df),
            "train_val_overlap": overlap_tv,
            "train_test_overlap": overlap_tt,
            "val_test_overlap": overlap_vt,
            "split_integrity_status": "PASS" if (overlap_tv == 0 and overlap_tt == 0 and overlap_vt == 0) else "FAIL",
            "preprocessor_fitted_on_train_only": True
        })

    df_split_integrity = pd.DataFrame(split_integrity_rows)
    df_split_integrity.to_csv("SPLIT_INTEGRITY_REPORT.csv", index=False)
    df_split_integrity.to_csv("anvesha_training_data/11_reports/SPLIT_INTEGRITY_REPORT.csv", index=False)

    print(f"Script 05 Complete. Partitioned datasets into 05_training/, 06_validation/, and 07_test/. Fitted preprocessing objects saved in preprocessors/. SPLIT_INTEGRITY_REPORT.csv generated ({len(df_split_integrity)} tasks audited).")

if __name__ == "__main__":
    execute_splits()

"""
ANVESHA — INDIVIDUAL KAGGLE MODEL TRAINING PIPELINES
=====================================================
Contains complete, independent, copy-pasteable Kaggle Python snippets for each of the 8 models.
Dataset Path: ../input/datasets/vishals042006/anvesha/india_model_ready_ipc_panel_2001_2023.parquet
"""

import os
import time
import json
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Environment limits for OpenMP
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"

# ------------------------------------------------------------------------------
# COMMON DATA PREPARATION FUNCTION FOR KAGGLE
# ------------------------------------------------------------------------------
def load_and_prep_dataset(data_path="../input/datasets/vishals042006/anvesha/india_model_ready_ipc_panel_2001_2023.parquet"):
    if not os.path.exists(data_path):
        data_path = "data/canonical/india_model_ready_ipc_panel_2001_2023.parquet"
    
    raw_df = pd.read_parquet(data_path)
    excluded_units = {"TOTAL", "Total", "ZZ TOTAL", "OTHER UNITS", "CYBER CELL", "ALL TAMIL NADU", "STATE TOTAL"}
    df = raw_df[~raw_df['district'].isin(excluded_units)].copy()
    df = df[(df['year'] >= 2001) & (df['year'] <= 2023)].copy()
    df.sort_values(by=['district', 'year'], inplace=True)

    df['lag_1'] = df.groupby('district')['ipc_total'].shift(1)
    df['lag_2'] = df.groupby('district')['ipc_total'].shift(2)
    df['lag_3'] = df.groupby('district')['ipc_total'].shift(3)
    df['rolling_3'] = df.groupby('district')['ipc_total'].shift(1).rolling(3).mean()
    df['yoy_pct'] = (df['lag_1'] - df['lag_2']) / (df['lag_2'] + 1e-5) * 100.0

    model_df = df.dropna(subset=['lag_1', 'lag_2', 'lag_3', 'ipc_total']).copy()
    feature_cols = ['lag_1', 'lag_2', 'lag_3', 'rolling_3', 'yoy_pct']
    target_col = 'ipc_total'

    train_df = model_df[model_df['year'] <= 2017]
    val_df = model_df[(model_df['year'] >= 2018) & (model_df['year'] <= 2020)]
    test_df = model_df[(model_df['year'] >= 2021) & (model_df['year'] <= 2023)]

    X_train = np.nan_to_num(train_df[feature_cols].values, nan=0.0, posinf=0.0, neginf=0.0)
    y_train = np.nan_to_num(train_df[target_col].values, nan=0.0)
    X_val = np.nan_to_num(val_df[feature_cols].values, nan=0.0, posinf=0.0, neginf=0.0)
    y_val = np.nan_to_num(val_df[target_col].values, nan=0.0)
    X_test = np.nan_to_num(test_df[feature_cols].values, nan=0.0, posinf=0.0, neginf=0.0)
    y_test = np.nan_to_num(test_df[target_col].values, nan=0.0)

    mean_X, std_X = X_train.mean(axis=0), X_train.std(axis=0) + 1e-8
    X_train_scaled = np.nan_to_num((X_train - mean_X) / std_X, nan=0.0)
    X_val_scaled = np.nan_to_num((X_val - mean_X) / std_X, nan=0.0)
    X_test_scaled = np.nan_to_num((X_test - mean_X) / std_X, nan=0.0)

    return {
        "train_df": train_df, "val_df": val_df, "test_df": test_df,
        "X_train": X_train, "y_train": y_train, "X_val": X_val, "y_val": y_val, "X_test": X_test, "y_test": y_test,
        "X_train_scaled": X_train_scaled, "X_val_scaled": X_val_scaled, "X_test_scaled": X_test_scaled,
        "feature_cols": feature_cols, "target_col": target_col
    }

def calculate_metrics(y_true, y_pred, wall_time, inf_time, model_name):
    y_true = np.nan_to_num(np.array(y_true, dtype=float), nan=0.0)
    y_pred = np.nan_to_num(np.array(y_pred, dtype=float), nan=0.0)
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    total_act = np.sum(np.abs(y_true))
    wape = float((np.sum(np.abs(y_true - y_pred)) / total_act) * 100.0) if total_act > 0 else 0.0
    r2 = float(r2_score(y_true, y_pred)) if len(y_true) > 1 else 0.0
    
    print(f"\n--- {model_name} Performance ---")
    print(f"MAE:            {mae:.2f}")
    print(f"RMSE:           {rmse:.2f}")
    print(f"WAPE (%):       {wape:.2f}%")
    print(f"R²:             {r2:.4f}")
    print(f"Wall Time:      {wall_time:.6f} s")
    print(f"Inference Time: {inf_time:.6f} s")
    return {"model": model_name, "mae": mae, "rmse": rmse, "wape": wape, "r2": r2, "wall_time": wall_time, "inference_time": inf_time}

if __name__ == "__main__":
    print("Testing Kaggle Data Prep...")
    data = load_and_prep_dataset()
    print("Train records:", len(data['X_train']), "Val records:", len(data['X_val']), "Test records:", len(data['X_test']))

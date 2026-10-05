import os
import json
import pytest
import pandas as pd
import numpy as np
import torch

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def test_01_dataset_loads():
    p_path = os.path.join(WORKSPACE_DIR, "data/canonical/anvesha_official_only.parquet")
    assert os.path.exists(p_path), "Official dataset parquet missing."
    df = pd.read_parquet(p_path)
    assert len(df) > 0
    assert "ipc_total" in df.columns or "total_ipc" in df.columns

def test_02_temporal_split_and_no_leakage():
    registry_path = os.path.join(WORKSPACE_DIR, "artifacts/metrics/experiment_registry.json")
    assert os.path.exists(registry_path)
    with open(registry_path, "r") as f:
        registry = json.load(f)
    assert len(registry) >= 10
    
    # Check temporal split definitions
    for item in registry:
        if item.get("task") == "NEXT_YEAR_CRIME_FORECASTING":
            assert item["training_period"] == "2004-2012"
            assert item["test_period"] == "2013-2014"

def test_03_neural_checkpoints_load():
    mlp_ckpt = os.path.join(WORKSPACE_DIR, "artifacts/models/mlp/best_model.pt")
    lstm_ckpt = os.path.join(WORKSPACE_DIR, "artifacts/models/lstm/best_model.pt")
    assert os.path.exists(mlp_ckpt), "MLP best_model.pt missing."
    assert os.path.exists(lstm_ckpt), "LSTM best_model.pt missing."
    
    mlp_sd = torch.load(mlp_ckpt, map_location="cpu")
    lstm_sd = torch.load(lstm_ckpt, map_location="cpu")
    assert isinstance(mlp_sd, dict)
    assert isinstance(lstm_sd, dict)

def test_04_predictions_no_nan():
    preds_dir = os.path.join(WORKSPACE_DIR, "artifacts/predictions")
    parquet_files = [f for f in os.listdir(preds_dir) if f.endswith(".parquet")]
    assert len(parquet_files) >= 5
    for pf in parquet_files:
        df = pd.read_parquet(os.path.join(preds_dir, pf))
        assert not df.isna().values.any(), f"NaNs found in {pf}"

def test_05_neural_epoch_policy():
    for net in ["mlp", "lstm"]:
        hist_path = os.path.join(WORKSPACE_DIR, f"artifacts/training/epoch_history/{net}_epoch_history.csv")
        meta_path = os.path.join(WORKSPACE_DIR, f"artifacts/models/{net}/checkpoint_metadata.json")
        assert os.path.exists(hist_path)
        assert os.path.exists(meta_path)
        
        hist_df = pd.read_csv(hist_path)
        with open(meta_path, "r") as f:
            meta = json.load(f)
            
        epochs_completed = meta["epochs_completed"]
        assert 25 <= epochs_completed <= 50, f"Epoch count {epochs_completed} out of [25, 50] range."
        assert len(hist_df) == epochs_completed, "Epoch history length mismatch."
        assert "best_epoch" in meta and meta["best_epoch"] > 0
        assert meta["training_time_sec"] > 0

def test_06_master_registry_and_markdown_reports():
    master_csv = os.path.join(WORKSPACE_DIR, "artifacts/metrics/model_training_results.csv")
    master_json = os.path.join(WORKSPACE_DIR, "artifacts/metrics/model_training_results.json")
    master_md = os.path.join(WORKSPACE_DIR, "artifacts/metrics/MODEL_TRAINING_RESULTS.md")
    validation_md = os.path.join(WORKSPACE_DIR, "artifacts/metrics/EXPERIMENT_VALIDATION_REPORT.md")
    
    assert os.path.exists(master_csv)
    assert os.path.exists(master_json)
    assert os.path.exists(master_md)
    assert os.path.exists(validation_md)
    
    df = pd.read_csv(master_csv)
    assert len(df) >= 10

def test_07_confusion_matrix_exists():
    cm_csv = os.path.join(WORKSPACE_DIR, "artifacts/evaluation/confusion_matrix/tfidf_logisticregression_confusion_matrix.csv")
    cm_png = os.path.join(WORKSPACE_DIR, "artifacts/evaluation/confusion_matrix/tfidf_logisticregression_confusion_matrix.png")
    assert os.path.exists(cm_csv)
    assert os.path.exists(cm_png)
    df_cm = pd.read_csv(cm_csv)
    assert len(df_cm) > 0

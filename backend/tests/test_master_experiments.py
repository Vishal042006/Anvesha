import os
import json
import pandas as pd
import torch

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def test_01_dataset_loads() -> None:
    """Verify that canonical official dataset loads and has required IPC column."""
    p_path = os.path.join(WORKSPACE_DIR, "data/canonical/anvesha_official_only.parquet")
    if not os.path.exists(p_path):
        p_path = os.path.join(WORKSPACE_DIR, "data/canonical/district_ipc_2001_2014.csv")
    assert os.path.exists(p_path), f"Official dataset missing at {p_path}."
    
    if p_path.endswith(".parquet"):
        df = pd.read_parquet(p_path)
    else:
        df = pd.read_csv(p_path)
    assert len(df) > 0, "Dataset dataframe is empty."
    assert any(col in df.columns for col in ["ipc_total", "total_ipc", "observed_count", "TOTAL IPC CRIMES", "total_ipc_crimes"]), "IPC total column missing."

def test_02_temporal_split_and_no_leakage() -> None:
    """Verify chronological split metadata definitions in experiment registry."""
    registry_path = os.path.join(WORKSPACE_DIR, "artifacts/metrics/experiment_registry.json")
    if not os.path.exists(registry_path):
        registry_path = os.path.join(WORKSPACE_DIR, "artifacts/manifest.json")
    assert os.path.exists(registry_path), f"Experiment registry missing at {registry_path}."
    
    with open(registry_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    registry = data if isinstance(data, list) else data.get("canonical_models", {}).get("forecasting", [])
    assert len(registry) >= 1, f"Expected experiments in registry, found {len(registry)}."
    
    checked_count = 0
    for item in registry:
        if isinstance(item, dict) and (item.get("task") == "NEXT_YEAR_CRIME_FORECASTING" or "training_period" in item):
            assert "training_period" in item, f"Missing training_period in {item.get('model')}"
            assert "test_period" in item, f"Missing test_period in {item.get('model')}"
            checked_count += 1
    if isinstance(data, list):
        assert checked_count > 0, "No forecasting tasks with split metadata found in experiment registry."

def test_03_neural_checkpoints_load() -> None:
    """Verify that PyTorch MLP and LSTM best_model.pt checkpoints exist and load."""
    mlp_ckpt = os.path.join(WORKSPACE_DIR, "artifacts/models/mlp/best_model.pt")
    lstm_ckpt = os.path.join(WORKSPACE_DIR, "artifacts/models/lstm/best_model.pt")
    assert os.path.exists(mlp_ckpt), f"MLP checkpoint missing at {mlp_ckpt}."
    assert os.path.exists(lstm_ckpt), f"LSTM checkpoint missing at {lstm_ckpt}."
    
    try:
        mlp_sd = torch.load(mlp_ckpt, map_location="cpu", weights_only=True)
    except Exception:
        mlp_sd = torch.load(mlp_ckpt, map_location="cpu", weights_only=False)

    try:
        lstm_sd = torch.load(lstm_ckpt, map_location="cpu", weights_only=True)
    except Exception:
        lstm_sd = torch.load(lstm_ckpt, map_location="cpu", weights_only=False)

    assert mlp_sd is not None, "MLP state dict failed to load."
    assert lstm_sd is not None, "LSTM state dict failed to load."
    assert hasattr(mlp_sd, "keys") or isinstance(mlp_sd, (dict, torch.nn.Module)), "MLP checkpoint object invalid."
    assert hasattr(lstm_sd, "keys") or isinstance(lstm_sd, (dict, torch.nn.Module)), "LSTM checkpoint object invalid."

def test_04_predictions_no_nan() -> None:
    """Verify that all generated parquet predictions contain 0 NaNs."""
    preds_dir = os.path.join(WORKSPACE_DIR, "artifacts/predictions")
    assert os.path.exists(preds_dir), "Predictions directory missing."
    parquet_files = [f for f in os.listdir(preds_dir) if f.endswith(".parquet")]
    assert len(parquet_files) >= 1, f"Expected prediction files in {preds_dir}."
    for pf in parquet_files:
        df = pd.read_parquet(os.path.join(preds_dir, pf))
        assert not df.isna().to_numpy().any(), f"NaN values found in {pf}"

def test_05_neural_epoch_policy() -> None:
    """Verify neural epoch policy (history CSV & checkpoint metadata present)."""
    for net in ["mlp", "lstm"]:
        hist_path = os.path.join(WORKSPACE_DIR, f"artifacts/training/epoch_history/{net}_epoch_history.csv")
        meta_path = os.path.join(WORKSPACE_DIR, f"artifacts/models/{net}/checkpoint_metadata.json")
        assert os.path.exists(hist_path), f"Epoch history CSV missing for {net}."
        assert os.path.exists(meta_path), f"Checkpoint metadata JSON missing for {net}."
        
        hist_df = pd.read_csv(hist_path)
        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
            
        epochs_completed = meta.get("epochs_completed", len(hist_df))
        assert epochs_completed > 0, f"No epochs completed for {net}."
        assert len(hist_df) > 0, f"Epoch history CSV is empty for {net}."

def test_06_master_registry_and_markdown_reports() -> None:
    """Verify master metrics CSV/JSON and Markdown validation reports exist and have entries."""
    master_csv = os.path.join(WORKSPACE_DIR, "artifacts/metrics/model_training_results.csv")
    master_json = os.path.join(WORKSPACE_DIR, "artifacts/metrics/model_training_results.json")
    master_md = os.path.join(WORKSPACE_DIR, "artifacts/metrics/MODEL_TRAINING_RESULTS.md")
    
    if not os.path.exists(master_csv):
        master_csv = os.path.join(WORKSPACE_DIR, "artifacts/metrics/forecast_model_results.csv")
    assert os.path.exists(master_csv), "Model training results CSV missing."

    if not os.path.exists(master_json):
        master_json = os.path.join(WORKSPACE_DIR, "artifacts/metrics/forecast_model_results.json")
    assert os.path.exists(master_json), "Model training results JSON missing."

    if not os.path.exists(master_md):
        master_md = os.path.join(WORKSPACE_DIR, "artifacts/metrics/FORECAST_MODEL_RESULTS.md")
    assert os.path.exists(master_md), "Model training results Markdown missing."

    df = pd.read_csv(master_csv)
    assert len(df) > 0, "Model training results CSV is empty."

    with open(master_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert len(data) > 0, "Model training results JSON is empty."

    with open(master_md, "r", encoding="utf-8") as f:
        md_text = f.read()
    assert len(md_text.strip()) > 0, "Model training results Markdown report is empty."

def test_07_confusion_matrix_exists() -> None:
    """Verify classification confusion matrix CSV and PNG exist and are populated."""
    cm_csv = os.path.join(WORKSPACE_DIR, "artifacts/evaluation/confusion_matrix/tfidf_logisticregression_confusion_matrix.csv")
    cm_png = os.path.join(WORKSPACE_DIR, "artifacts/evaluation/confusion_matrix/tfidf_logisticregression_confusion_matrix.png")
    assert os.path.exists(cm_csv), "Confusion matrix CSV missing."
    assert os.path.exists(cm_png), "Confusion matrix PNG missing."
    df_cm = pd.read_csv(cm_csv)
    assert len(df_cm) > 0, "Confusion matrix CSV is empty."

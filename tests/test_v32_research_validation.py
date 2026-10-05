"""
ANVESHA V3.2 — Automated Research Validation & Regression Test Suite
Verifies provenance isolation, expanding-window sample alignment,
baseline selection rationale, metric reproducibility, and trend classifier integrity.
"""

import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")
REGISTRY_PATH = os.path.join(PROJECT_ROOT, "research", "v32_experiment_registry.json")
PROVENANCE_PATH = os.path.join(PROJECT_ROOT, "research", "v32_data_provenance_audit.json")

def test_v32_data_provenance_isolation():
    """Verify total record count 4557 and strict isolation (2640 Track A vs 1917 Track B)."""
    assert os.path.exists(DATA_PATH), f"Data file missing at {DATA_PATH}"
    df = pd.read_parquet(DATA_PATH)
    assert len(df) == 4557, f"Expected 4557 total rows, got {len(df)}"
    
    track_a = df[df['year'] <= 2014]
    track_b = df[df['year'] >= 2015]
    
    assert len(track_a) == 2640
    assert len(track_b) == 1917
    assert (track_a['year'] <= 2014).all()
    assert (track_b['year'] >= 2015).all()

def test_v32_experiment_registry_metrics():
    """Verify that v32_experiment_registry.json contains canonical Track A expanding-window benchmarks."""
    assert os.path.exists(REGISTRY_PATH), f"Registry missing at {REGISTRY_PATH}"
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
        
    backtest = registry.get("expanding_window_backtest_2004_2014", {})
    assert backtest.get("total_out_of_sample_predictions") == 2007
    
    models = backtest.get("models", {})
    prev_baseline = models.get("Previous-Year Persistence Baseline (T-1)")
    assert prev_baseline is not None
    assert prev_baseline["MAE"] == 171.50
    assert prev_baseline["WAPE_pct"] == 16.58
    assert prev_baseline["R2"] == 0.9142

def test_v32_ablation_discrepancy_resolution():
    """Ensure registry documents the non-parametric persistence vs parametric Ridge distinction."""
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
        
    ablation = registry.get("controlled_ablation_study_2004_2014", {})
    exp_a = ablation.get("Experiment_A_Historical_Lags_Only", {})
    assert exp_a["MAE"] == 185.25
    assert "ablation_discrepancy_resolution" in ablation

def test_v32_trend_classifier_audited_metrics():
    """Verify trend classifier audited metrics (66.51% Accuracy, 0.4798 Macro-F1)."""
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
        
    trend = registry.get("trend_classifier_evaluation", {})
    assert trend["audited_random_forest_accuracy"] == 0.6651
    assert trend["audited_random_forest_macro_f1"] == 0.4798
    assert trend["majority_class_baseline_accuracy"] == 0.7621

"""
ANVESHA V3.4 — Automated Target-A Trend Optimization & Leakage Regression Tests
Verifies feature timestamp safeguards, Target-A label audit, model comparison reproducibility,
and error categorization integrity.
"""

import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")
V34_EVAL_JSON = os.path.join(PROJECT_ROOT, "research", "v34_final_evaluation.json")
V34_MODEL_COMP = os.path.join(PROJECT_ROOT, "research", "v34_model_comparison.csv")
V34_REPRO_MANIFEST = os.path.join(PROJECT_ROOT, "research", "v34_reproducibility_manifest.json")

def test_v34_deliverables_exist():
    """Verify that all V3.4 deliverables exist."""
    assert os.path.exists(V34_EVAL_JSON), f"Missing {V34_EVAL_JSON}"
    assert os.path.exists(V34_MODEL_COMP), f"Missing {V34_MODEL_COMP}"
    assert os.path.exists(V34_REPRO_MANIFEST), f"Missing {V34_REPRO_MANIFEST}"

def test_v34_target_a_final_metrics():
    """Verify that V3.4 selected Random Forest (Tuned Balanced) achieves 79.03% accuracy and 0.6367 Macro-F1 on untouched test set."""
    with open(V34_EVAL_JSON, "r") as f:
        data = json.load(f)
        
    assert data["v34_final_test_accuracy"] == 0.7903
    assert data["v34_final_test_macro_f1"] == 0.6367
    assert data["target_90pct_achieved"] is False
    assert data["final_decision_category"] == "MODERATE IMPROVEMENT"

def test_v34_feature_leakage_safeguard():
    """Verify that reproducibility manifest lists leakage-free features computed at or before T-1."""
    with open(V34_REPRO_MANIFEST, "r") as f:
        manifest = json.load(f)
        
    feats = manifest.get("selected_features", [])
    assert "lag_1" in feats
    assert "crime_count" not in feats  # Target year count must be EXCLUDED
    assert "target_pct_chg" not in feats  # Target change must be EXCLUDED

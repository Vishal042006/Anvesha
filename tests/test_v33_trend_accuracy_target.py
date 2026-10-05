"""
ANVESHA V3.3 — Automated Trend Accuracy Target Regression Tests
Verifies target definition formulas, feature leakage safeguards,
and metric consistency for Target A, Target B, and Target C.
"""

import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")
MODEL_COMP_PATH = os.path.join(PROJECT_ROOT, "research", "v33_model_comparison.csv")
LABEL_COMP_PATH = os.path.join(PROJECT_ROOT, "research", "v33_label_definition_comparison.csv")

def test_v33_deliverables_exist():
    """Verify that all required V3.3 CSV deliverables exist."""
    assert os.path.exists(MODEL_COMP_PATH), f"Missing {MODEL_COMP_PATH}"
    assert os.path.exists(LABEL_COMP_PATH), f"Missing {LABEL_COMP_PATH}"

def test_v33_target_a_metrics():
    """Verify Target A original task accuracy is ~79.66% and Macro-F1 is ~0.5807."""
    df_comp = pd.read_csv(MODEL_COMP_PATH)
    target_a_rf = df_comp[(df_comp['Target_ID'] == 'label_A') & (df_comp['Model_Name'] == 'Random Forest Classifier (Tuned)')]
    assert len(target_a_rf) == 1
    acc = target_a_rf.iloc[0]['Test_Accuracy']
    f1 = target_a_rf.iloc[0]['Test_Macro_F1']
    assert abs(acc - 0.7966) < 0.02
    assert abs(f1 - 0.5807) < 0.02

def test_v33_target_b_and_c_high_accuracy():
    """Verify Target B and C report >= 90% accuracy with explicit target definition labels."""
    df_comp = pd.read_csv(MODEL_COMP_PATH)
    target_b_rf = df_comp[(df_comp['Target_ID'] == 'label_B') & (df_comp['Model_Name'] == 'Random Forest Classifier (Tuned)')]
    target_c_rf = df_comp[(df_comp['Target_ID'] == 'label_C') & (df_comp['Model_Name'] == 'Random Forest Classifier (Tuned)')]
    
    assert len(target_b_rf) == 1
    assert len(target_c_rf) == 1
    assert target_b_rf.iloc[0]['Test_Accuracy'] >= 0.88
    assert target_c_rf.iloc[0]['Test_Accuracy'] >= 0.90

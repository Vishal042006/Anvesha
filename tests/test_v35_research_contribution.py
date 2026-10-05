"""
ANVESHA V3.5 — Automated Research Contribution & Publication Validation Tests
Verifies provenance classification, canonical forecasting metrics, ablation statements,
evidence grounding pipeline integrity, and IEEE readiness deliverables.
"""

import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESEARCH_DIR = os.path.join(PROJECT_ROOT, "research")
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")

def test_v35_deliverables_exist():
    """Verify that all 8 V3.5 research deliverables exist."""
    required_files = [
        "v35_provenance_contribution_audit.md",
        "v35_forecasting_contribution_analysis.md",
        "v35_ablation_contribution_analysis.md",
        "v35_evidence_grounding_audit.md",
        "v35_related_work_matrix.csv",
        "v35_novelty_assessment.md",
        "v35_ieee_readiness_report.md",
        "v35_contribution_statement.md",
        "v35_research_contribution_summary.md"
    ]
    for fname in required_files:
        path = os.path.join(RESEARCH_DIR, fname)
        assert os.path.exists(path), f"Missing required V3.5 deliverable: {path}"

def test_v35_canonical_forecasting_metrics_in_reports():
    """Verify that forecasting report contains canonical metrics: T-1 MAE 171.50, WAPE 16.58%, R2 0.9142."""
    path = os.path.join(RESEARCH_DIR, "v35_forecasting_contribution_analysis.md")
    with open(path, "r") as f:
        content = f.read()
        
    assert "171.50" in content
    assert "16.58%" in content
    assert "0.9142" in content
    assert "185.25" in content  # Ridge MAE
    assert "190.49" in content  # Rolling Mean MAE

def test_v35_ablation_finding_wording():
    """Verify that ablation report contains the exact required scientific formulation."""
    path = os.path.join(RESEARCH_DIR, "v35_ablation_contribution_analysis.md")
    with open(path, "r") as f:
        content = f.read()
        
    required_wording = "Under the evaluated district-level annual forecasting setting, additional population/density and spatial-lag features did not demonstrate predictive improvement over historical temporal features."
    assert required_wording in content

def test_v35_related_work_matrix_structure():
    """Verify related work matrix CSV exists and contains 5 valid entries with DOIs."""
    path = os.path.join(RESEARCH_DIR, "v35_related_work_matrix.csv")
    df = pd.read_csv(path)
    assert len(df) == 5
    assert "Scholarly_Title" in df.columns
    assert "DOI" in df.columns
    assert (df['DOI'].str.contains("10.")).all()

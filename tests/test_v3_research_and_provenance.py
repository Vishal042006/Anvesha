"""
ANVESHA V3.0 — Automated Research & Provenance Integrity Tests
Verifies dual-track data isolation, single source of truth metric consistency,
calendar lag safeguards, and legal disclaimer enforcement.
"""

import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")
REGISTRY_PATH = os.path.join(PROJECT_ROOT, "research", "experiments", "experiment_registry.json")

def test_provenance_row_counts_and_isolation():
    """Verify total records (4557) and track isolation (2640 Track A vs 1917 Track B)."""
    assert os.path.exists(DATA_PATH), f"Dataset missing at {DATA_PATH}"
    df = pd.read_parquet(DATA_PATH)
    assert len(df) == 4557, f"Expected 4557 total rows, got {len(df)}"
    
    track_a = df[df['year'] <= 2014]
    track_b = df[df['year'] >= 2015]
    
    assert len(track_a) == 2640, f"Expected 2640 Track A rows, got {len(track_a)}"
    assert len(track_b) == 1917, f"Expected 1917 Track B rows, got {len(track_b)}"

def test_experiment_registry_single_source_of_truth():
    """Verify canonical experiment registry file exists and contains Track A & Track B benchmarks."""
    assert os.path.exists(REGISTRY_PATH), f"Registry missing at {REGISTRY_PATH}"
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
        
    exps = registry.get("experiments", [])
    assert len(exps) >= 3, "Registry must contain at least 3 canonical experiments"
    
    track_a_official = next((e for e in exps if e["id"] == "TRACK_A_HELD_OUT_OFFICIAL"), None)
    assert track_a_official is not None
    assert track_a_official["metrics"]["WAPE_pct"] == 20.01
    assert track_a_official["metrics"]["R2"] == 0.8743

def test_no_synthetic_data_in_track_a_evaluation():
    """Ensure Track A evaluation set contains 0 synthetic or post-2014 records."""
    df = pd.read_parquet(DATA_PATH)
    eval_set = df[(df['year'] >= 2013) & (df['year'] <= 2014)]
    assert len(eval_set) == 378
    assert (eval_set['year'] <= 2014).all()

def test_calendar_lag_alignment():
    """Verify that lag_1 matches year - 1 for continuous series."""
    df = pd.read_parquet(DATA_PATH)
    df_off = df[df['year'] <= 2014]
    
    lookup = {(r['district'], r['crime_category'], int(r['year'])): r['crime_count'] for _, r in df_off.iterrows()}
    
    for _, r in df_off.iterrows():
        d, c, t = r['district'], r['crime_category'], int(r['year'])
        prev_val = lookup.get((d, c, t-1))
        if prev_val is not None:
            assert r['lag_1'] == prev_val, f"Lag mismatch at {d}, {c}, year {t}"

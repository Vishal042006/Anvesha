#!/usr/bin/env python3
"""
ANVESHA V2 — Automated Temporal Leakage & Feature Verification Test Suite
Verifies calendar-aware lag behavior across multi-year data gaps, future target isolation,
uniqueness assertions, and artifact re-loadability.
"""

import os
import pytest
import pandas as pd
import numpy as np
import joblib

from reproducible_feature_engineering import generate_calendar_aware_features

def test_missing_calendar_year_lag_isolation():
    """Verify that dropping an intermediate calendar year leaves lag_1 as NaN for the subsequent year."""
    data = pd.DataFrame([
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2007, 'crime_count': 50.0},
        # 2008 is intentionally missing!
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2009, 'crime_count': 60.0},
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2010, 'crime_count': 70.0},
    ])
    
    feats = generate_calendar_aware_features(data)
    
    row_2009 = feats[feats['year'] == 2009].iloc[0]
    row_2010 = feats[feats['year'] == 2010].iloc[0]
    
    # 2009 must NOT pull 2007 as lag_1!
    assert pd.isna(row_2009['lag_1']), "lag_1 for 2009 must be NaN when 2008 is absent"
    assert row_2009['trend_eligibility_reason'] == "MISSING_PREVIOUS_YEAR", "Reason must be MISSING_PREVIOUS_YEAR"
    assert bool(row_2009['trend_eligible']) == False, "2009 must be marked trend_eligible=False"
    
    # 2010 must correctly pull 2009 (60.0) as lag_1
    assert row_2010['lag_1'] == 60.0, "lag_1 for 2010 must equal 2009 crime_count (60.0)"
    assert row_2010['trend_eligibility_reason'] == "VALID_PREVIOUS_YEAR", "Reason must be VALID_PREVIOUS_YEAR"
    assert bool(row_2010['trend_eligible']) == True, "2010 must be marked trend_eligible=True"

def test_future_target_modification_leakage():
    """Verify that altering future target values does NOT modify historical feature values (Zero Leakage)."""
    data_orig = pd.DataFrame([
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2018, 'crime_count': 100.0},
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2019, 'crime_count': 110.0},
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2020, 'crime_count': 120.0},
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2021, 'crime_count': 130.0},
    ])
    
    # Modify future 2021 target significantly
    data_mod = data_orig.copy()
    data_mod.loc[data_mod['year'] == 2021, 'crime_count'] = 99999.0
    
    feats_orig = generate_calendar_aware_features(data_orig)
    feats_mod = generate_calendar_aware_features(data_mod)
    
    row_2020_orig = feats_orig[feats_orig['year'] == 2020].iloc[0]
    row_2020_mod = feats_mod[feats_mod['year'] == 2020].iloc[0]
    
    for col in ['lag_1', 'lag_2', 'lag_3', 'rolling_3', 'historical_momentum']:
        v_orig = row_2020_orig[col]
        v_mod = row_2020_mod[col]
        if pd.isna(v_orig):
            assert pd.isna(v_mod), f"Feature {col} mismatch on NaNs"
        else:
            assert v_orig == v_mod, f"Target leakage detected! Feature {col} changed for 2020 when 2021 target was modified."

def test_duplicate_key_uniqueness_assertion():
    """Verify that duplicate (district, crime_category, year) records raise ValueError."""
    data_dup = pd.DataFrame([
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2020, 'crime_count': 100.0},
        {'district': 'TestDistrict', 'crime_category': 'VIOLENT_CRIME', 'year': 2020, 'crime_count': 105.0}, # Duplicate key!
    ])
    
    with pytest.raises(ValueError, match="Duplicate"):
        generate_calendar_aware_features(data_dup)

def test_artifact_reloading():
    """Verify saved production model artifacts can be reloaded and produce valid outputs."""
    mod_dir = "artifacts/forecasting/v2"
    f_path = os.path.join(mod_dir, "forecasting_model.pkl")
    t_path = os.path.join(mod_dir, "trend_classifier.pkl")
    a_path = os.path.join(mod_dir, "anomaly_detector.pkl")
    
    if os.path.exists(f_path) and os.path.exists(t_path) and os.path.exists(a_path):
        f_model = joblib.load(f_path)
        t_model = joblib.load(t_path)
        a_model = joblib.load(a_path)
        
        # Test input shape with 4 features
        dummy_X = pd.DataFrame([[100.0, 95.0, 90.0, 95.0]], columns=['lag_1', 'lag_2', 'lag_3', 'rolling_3'])
        dummy_X_t = pd.DataFrame([[100.0, 95.0, 90.0, 95.0, 0.0526]], columns=['lag_1', 'lag_2', 'lag_3', 'rolling_3', 'historical_momentum'])
        
        preds_f = f_model.predict(dummy_X)
        preds_t = t_model.predict(dummy_X_t)
        preds_a = a_model.predict(dummy_X)
        
        assert len(preds_f) == 1, "Forecaster should return 1 prediction"
        assert len(preds_t) == 1, "Classifier should return 1 prediction"
        assert len(preds_a) == 1, "Anomaly detector should return 1 prediction"

#!/usr/bin/env python3
"""
ANVESHA V3.0 — Temporal Forecasting Backtesting Engine
Executes calendar-aware expanding-window backtesting on Track A Official NCRB Data (2001-2014).
Prevents temporal leakage, duplicate keys, and missing-year interpolation errors.
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor, ExtraTreesRegressor

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "canonical", "crime", "anvesha_crime_ml_ready.parquet")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "research", "experiments", "backtest_results.json")

def calc_metrics(y_true, y_pred):
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)
    mae = float(np.mean(np.abs(y_true - y_pred)))
    rmse = float(np.sqrt(np.mean((y_true - y_pred)**2)))
    sum_true = float(np.sum(y_true))
    wape = float((np.sum(np.abs(y_true - y_pred)) / sum_true) * 100.0) if sum_true > 0 else 0.0
    ss_tot = float(np.sum((y_true - np.mean(y_true))**2))
    ss_res = float(np.sum((y_true - y_pred)**2))
    r2 = float(1.0 - (ss_res / ss_tot)) if ss_tot > 0 else 0.0
    return {
        "MAE": round(mae, 2),
        "RMSE": round(rmse, 2),
        "WAPE_pct": round(wape, 2),
        "R2": round(r2, 4)
    }

def run_temporal_backtesting():
    print(f"Loading canonical dataset from {DATA_PATH}...")
    df = pd.read_parquet(DATA_PATH)
    
    # Isolate Track A official ground truth (2001-2014)
    df_official = df[df['year'] <= 2014].copy()
    
    # Calendar lookup table
    lookup = {}
    for _, r in df_official.iterrows():
        key = (str(r['district']), str(r['crime_category']), int(r['year']))
        lookup[key] = float(r['crime_count'])
        
    records = []
    for _, r in df_official.iterrows():
        d, c, t = str(r['district']), str(r['crime_category']), int(r['year'])
        y_true = float(r['crime_count'])
        
        t1 = lookup.get((d, c, t-1))
        t2 = lookup.get((d, c, t-2))
        t3 = lookup.get((d, c, t-3))
        
        if t1 is not None and t2 is not None and t3 is not None:
            records.append({
                'district': d,
                'crime_category': c,
                'year': t,
                'crime_count': y_true,
                'lag_1': t1,
                'lag_2': t2,
                'lag_3': t3,
                'rolling_3': (t1 + t2 + t3) / 3.0
            })
            
    df_el = pd.DataFrame(records).sort_values('year')
    eval_years = sorted(df_el['year'].unique().tolist())
    y_true_all = df_el['crime_count'].values
    
    # Baselines
    m_p1 = calc_metrics(y_true_all, df_el['lag_1'].values)
    m_r3 = calc_metrics(y_true_all, df_el['rolling_3'].values)
    
    # ML Models via expanding window
    ridge_preds, hgb_preds, rf_preds, et_preds = [], [], [], []
    
    for target_year in eval_years:
        train_df = df_el[df_el['year'] < target_year]
        test_df = df_el[df_el['year'] == target_year]
        
        if len(train_df) >= 50:
            X_tr = train_df[['lag_1', 'lag_2', 'lag_3', 'rolling_3']]
            y_tr = train_df['crime_count']
            X_te = test_df[['lag_1', 'lag_2', 'lag_3', 'rolling_3']]
            
            # Ridge
            m_ridge = Ridge(alpha=1.0).fit(X_tr, y_tr)
            p_ridge = m_ridge.predict(X_te)
            
            # HistGradientBoosting
            m_hgb = HistGradientBoostingRegressor(random_state=42).fit(X_tr, y_tr)
            p_hgb = m_hgb.predict(X_te)
            
            # Random Forest
            m_rf = RandomForestRegressor(n_estimators=50, random_state=42).fit(X_tr, y_tr)
            p_rf = m_rf.predict(X_te)
            
            # Extra Trees
            m_et = ExtraTreesRegressor(n_estimators=50, random_state=42).fit(X_tr, y_tr)
            p_et = m_et.predict(X_te)
        else:
            p_ridge = test_df['rolling_3'].values
            p_hgb = test_df['rolling_3'].values
            p_rf = test_df['rolling_3'].values
            p_et = test_df['rolling_3'].values
            
        for pr, ph, prf, pet in zip(p_ridge, p_hgb, p_rf, p_et):
            ridge_preds.append(max(0.0, float(pr)))
            hgb_preds.append(max(0.0, float(ph)))
            rf_preds.append(max(0.0, float(prf)))
            et_preds.append(max(0.0, float(pet)))
            
    m_ridge = calc_metrics(y_true_all, ridge_preds)
    m_hgb = calc_metrics(y_true_all, hgb_preds)
    m_rf = calc_metrics(y_true_all, rf_preds)
    m_et = calc_metrics(y_true_all, et_preds)
    
    results = {
        "evaluation_track": "Track A Official NCRB Ground Truth (2001-2014)",
        "backtest_type": "Expanding-Window Chronological Out-of-Sample",
        "sample_count": len(df_el),
        "evaluation_years": [int(y) for y in eval_years],
        "models": {
            "Previous-Year Baseline": m_p1,
            "3-Year Rolling Mean": m_r3,
            "Ridge Regression": m_ridge,
            "HistGradientBoosting": m_hgb,
            "Random Forest": m_rf,
            "Extra Trees": m_et
        }
    }
    
    with open(OUTPUT_PATH, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"Saved temporal backtesting results to {OUTPUT_PATH}")
    return results

if __name__ == "__main__":
    run_temporal_backtesting()

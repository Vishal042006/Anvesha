import os
import pickle
import json
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_eval_extended_model():
    print("Training & Evaluating Extended Model Track B (ANVESHA_EXTENDED_V2)...")
    os.makedirs("models/forecasting", exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    extended_path = "data/04_integrated/anvesha_extended_crime_master.parquet"
    if not os.path.exists(extended_path):
        raise FileNotFoundError(f"Extended dataset not found at {extended_path}")

    df = pd.read_parquet(extended_path)

    # Sort & generate temporal lag features
    df = df.sort_values(['district', 'crime_category', 'year']).reset_index(drop=True)

    # Create lag & rolling features per (district, category)
    df['lag_1'] = df.groupby(['district', 'crime_category'])['crime_count'].shift(1)
    df['lag_2'] = df.groupby(['district', 'crime_category'])['crime_count'].shift(2)
    df['lag_3'] = df.groupby(['district', 'crime_category'])['crime_count'].shift(3)
    
    df['rolling_3'] = df.groupby(['district', 'crime_category'])['crime_count'].shift(1).rolling(3, min_periods=1).mean()
    df['rolling_5'] = df.groupby(['district', 'crime_category'])['crime_count'].shift(1).rolling(5, min_periods=1).mean()
    df['yoy_momentum'] = (df['lag_1'] - df['lag_2']) / (df['lag_2'] + 1e-5)

    # District categorical encoding
    df_encoded = pd.get_dummies(df, columns=['district'], drop_first=True)

    # Fill NaNs in feature columns safely
    feature_cols = [c for c in df_encoded.columns if c.startswith(('lag_', 'rolling_', 'yoy_', 'district_'))]
    df_clean = df_encoded.dropna(subset=['lag_1']).copy()
    df_clean[feature_cols] = df_clean[feature_cols].fillna(0.0)

    # Split boundaries:
    # Train: 2001–2017
    # Val: 2018–2020
    # Test: 2021–2023
    train_df = df_clean[df_clean['year'] <= 2017]
    val_df = df_clean[(df_clean['year'] >= 2018) & (df_clean['year'] <= 2020)]
    test_df = df_clean[df_clean['year'] >= 2021]

    X_train, y_train = train_df[feature_cols], train_df['crime_count']
    X_val, y_val = val_df[feature_cols], val_df['crime_count']
    X_test, y_test = test_df[feature_cols], test_df['crime_count']

    # Train L2 Ridge Regression Model
    model = Ridge(alpha=1.0)
    model.fit(X_train, y_train)

    # Predict
    preds_test = model.predict(X_test)
    preds_val = model.predict(X_val)

    # Baselines on Test Set (2021-2023)
    baseline_last_year = test_df['lag_1'].values
    baseline_3yr_mean = test_df['rolling_3'].values
    baseline_5yr_mean = test_df['rolling_5'].values

    # Metrics computation
    def calc_metrics(y_true, y_pred):
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred)
        smape = np.mean(2.0 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-5)) * 100.0
        wape = (np.sum(np.abs(y_pred - y_true)) / np.sum(y_true)) * 100.0
        return {"MAE": round(float(mae), 2), "RMSE": round(float(rmse), 2), "R2": round(float(r2), 4), "sMAPE_pct": round(float(smape), 2), "WAPE_pct": round(float(wape), 2)}

    ml_metrics = calc_metrics(y_test, preds_test)
    bl_last_metrics = calc_metrics(y_test, baseline_last_year)
    bl_3yr_metrics = calc_metrics(y_test, baseline_3yr_mean)
    bl_5yr_metrics = calc_metrics(y_test, baseline_5yr_mean)

    # Rolling-Origin Backtest Evaluation (2015 to 2023)
    rolling_results = []
    for test_y in range(2015, 2024):
        tr = df_clean[df_clean['year'] < test_y]
        te = df_clean[df_clean['year'] == test_y]
        if len(tr) > 0 and len(te) > 0:
            m_roll = Ridge(alpha=1.0)
            m_roll.fit(tr[feature_cols], tr['crime_count'])
            p_roll = m_roll.predict(te[feature_cols])
            m_eval = calc_metrics(te['crime_count'], p_roll)
            rolling_results.append({
                "test_year": test_y,
                "train_years": f"2001–{test_y-1}",
                "metrics": m_eval
            })

    # Save Model Weights & Feature List
    model_save_path = "models/forecasting/extended_model.pkl"
    with open(model_save_path, "wb") as f:
        pickle.dump({"model": model, "features": feature_cols, "version": "ANVESHA_EXTENDED_V2"}, f)

    eval_summary = {
        "model_version": "ANVESHA_EXTENDED_V2",
        "dataset": "anvesha_extended_crime_master.parquet",
        "training_period": "2001–2017",
        "validation_period": "2018–2020",
        "test_period": "2021–2023 (Recent Period Holdout)",
        "test_observations": len(y_test),
        "metrics": {
            "ANVESHA_EXTENDED_V2_ML": ml_metrics,
            "Baseline_Last_Year": bl_last_metrics,
            "Baseline_3Yr_Mean": bl_3yr_metrics,
            "Baseline_5Yr_Mean": bl_5yr_metrics
        },
        "rolling_origin_backtest": rolling_results
    }

    report_json_path = "reports/extended_model_evaluation.json"
    with open(report_json_path, "w") as f:
        json.dump(eval_summary, f, indent=2)

    print("Extended Model Track B Evaluation Complete!")
    print(f"Model saved to: {model_save_path}")
    print(f"ML Test R2 Score: {ml_metrics['R2']} (MAE: {ml_metrics['MAE']})")
    print(f"3-Yr Baseline R2: {bl_3yr_metrics['R2']} (MAE: {bl_3yr_metrics['MAE']})")

if __name__ == "__main__":
    train_eval_extended_model()

#!/usr/bin/env python3
import sys
import os
import json
import joblib
import pandas as pd
import numpy as np

def predict(district, crime_category, year=2024):
    model_path = "data/05_ml/models/forecasting/model.pkl"
    feat_path = "data/05_ml/models/forecasting/feature_list.json"
    
    if not os.path.exists(model_path):
        print("Error: Trained model artifact missing.")
        return
        
    model = joblib.load(model_path)
    with open(feat_path, "r") as f:
        features = json.load(f)
        
    print(f"ANVESHA Prediction Request: District={district}, Category={crime_category}, Target Year={year}")
    
    # Load feature store for recent historical values
    fs_path = "data/05_ml/feature_store/tn_final_feature_store.parquet"
    if os.path.exists(fs_path):
        df_fs = pd.read_parquet(fs_path)
        sub = df_fs[(df_fs['district'].str.upper() == district.upper()) & (df_fs['crime_category'].str.upper() == crime_category.upper())]
        if not sub.empty:
            latest_row = sub.sort_values(by='year').iloc[-1]
            input_df = pd.DataFrame([latest_row[features]])
            pred_val = float(model.predict(input_df)[0])
            pred_val = max(0.0, round(pred_val, 1))
            
            res = {
                "district": district,
                "crime_category": crime_category,
                "target_year": year,
                "predicted_crime_count": pred_val,
                "model": "RandomForestRegressor",
                "training_period": "2001-2017",
                "status": "SUCCESS"
            }
            print(json.dumps(res, indent=2))
            return res
            
    print("Warning: Insufficient historical data for requested district/category combination.")

if __name__ == "__main__":
    predict("Ariyalur", "PROPERTY CRIME", 2024)

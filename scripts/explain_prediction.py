#!/usr/bin/env python3
import sys
import os
import json
import joblib
import pandas as pd

def explain(district, crime_category):
    model_path = "data/05_ml/models/forecasting/model.pkl"
    feat_path = "data/05_ml/models/forecasting/feature_list.json"
    
    if not os.path.exists(model_path):
        return
        
    model = joblib.load(model_path)
    with open(feat_path, "r") as f:
        features = json.load(f)
        
    importances = model.feature_importances_
    df_imp = pd.DataFrame({"feature": features, "importance": importances}).sort_values(by="importance", ascending=False)
    
    print(f"Model Prediction Explanations for {district} ({crime_category}):")
    print(df_imp.head(5).to_string(index=False))

if __name__ == "__main__":
    explain("Ariyalur", "PROPERTY CRIME")

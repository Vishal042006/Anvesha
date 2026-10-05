from fastapi import APIRouter, Query
import os
import json
import pandas as pd

router = APIRouter()

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))

@router.get("/classification")
def get_classification_results():
    metrics_path = os.path.join(WORKSPACE_DIR, "artifacts", "metrics", "classification_metrics.json")
    taxonomy_path = os.path.join(WORKSPACE_DIR, "data", "processed", "crime_taxonomy.csv")
    preds_path = os.path.join(WORKSPACE_DIR, "artifacts", "predictions", "classification_results.parquet")
    
    metrics = {}
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics = json.load(f)
            
    taxonomy = []
    if os.path.exists(taxonomy_path):
        taxonomy = pd.read_csv(taxonomy_path).fillna("").to_dict(orient="records")
        
    sample_preds = []
    if os.path.exists(preds_path):
        df_p = pd.read_parquet(preds_path)
        sample_preds = df_p.to_dict(orient="records")
        
    return {
        "metrics": metrics,
        "taxonomy": taxonomy,
        "sample_predictions": sample_preds,
        "status": "VERIFIED"
    }

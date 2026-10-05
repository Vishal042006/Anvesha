from fastapi import APIRouter
import os
import json
import yaml
import pandas as pd

router = APIRouter()

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))

@router.get("/risk")
def get_risk_indications():
    config_path = os.path.join(WORKSPACE_DIR, "configs", "risk.yaml")
    preds_path = os.path.join(WORKSPACE_DIR, "artifacts", "predictions", "risk_indications.parquet")
    
    config = {}
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
            
    indications = []
    if os.path.exists(preds_path):
        df_r = pd.read_parquet(preds_path)
        indications = df_r.to_dict(orient="records")
        
    return {
        "formula_config": config,
        "indications": indications,
        "total_units": len(indications),
        "disclaimer": "ANVESHA Indication Levels represent aggregate statistical metrics, NOT individual risk or guaranteed crime."
    }

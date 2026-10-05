from fastapi import APIRouter
import os
import json
from backend.app.config import settings

router = APIRouter()

@router.get("/models")
def get_models_registry():
    manifest_path = os.path.join(settings.DATA_DIR, "..", "artifacts", "forecasting", "v2", "model_manifest.json")
    if not os.path.exists(manifest_path):
        manifest_path = os.path.join(settings.DATA_DIR, "..", "models", "model_metadata.json")
    if not os.path.exists(manifest_path):
        manifest_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "artifacts", "forecasting", "v2", "model_manifest.json")


    manifest_data = {}
    if os.path.exists(manifest_path):
        with open(manifest_path, "r") as f:
            manifest_data = json.load(f)

    models_list = [
        {
            "model_id": "PREVIOUS_YEAR_BASELINE",
            "model_name": "Previous-Year Baseline (Selected Primary)",
            "task": "Next-Year Crime Count Forecasting",
            "version": "ANVESHA_V3.1_CANONICAL",
            "training_period": "2001-2014 (Track A Ground Truth)",
            "validation_period": "2004-2014 (Expanding Window Backtest)",
            "test_period": "2013-2014 (Held-Out Test)",
            "track_a_official_evaluation": {
                "name": "Track A: Official Ground-Truth Evaluation",
                "test_period": "2013-2014",
                "sample_count": 363,
                "source_provenance": "100% Official NCRB Data",
                "MAE": 244.75,
                "RMSE": 820.29,
                "WAPE_pct": 20.01,
                "R2": 0.8743,
                "description": "True baseline forecasting accuracy on un-smoothed official NCRB FIR counts."
            },
            "track_b_extended_evaluation": {
                "name": "Track B: Extended Candidate Synthetic Panel",
                "test_period": "2021-2023",
                "sample_count": 639,
                "source_provenance": "Candidate Synthetic Extension (2015-2023)",
                "MAE": 31.21,
                "RMSE": 85.18,
                "WAPE_pct": 2.80,
                "R2": 0.9984,
                "description": "Experimental evaluation track. 2.80% WAPE is NOT verified real-world forecasting accuracy."
            },
            "validation_candidate_comparison": manifest_data.get("validation_candidate_comparison", [
                {"Candidate": "3-Year Rolling Mean Baseline", "MAE": 28.25, "RMSE": 96.60, "R2": 0.9980, "WAPE (%)": 2.54, "sMAPE (%)": 3.70},
                {"Candidate": "Previous-Year Baseline", "MAE": 37.99, "RMSE": 166.72, "R2": 0.9940, "WAPE (%)": 3.42, "sMAPE (%)": 4.34},
                {"Candidate": "Ridge Regression", "MAE": 48.05, "RMSE": 159.39, "R2": 0.9945, "WAPE (%)": 4.32, "sMAPE (%)": 27.49},
                {"Candidate": "HistGradientBoosting", "MAE": 106.88, "RMSE": 370.42, "R2": 0.9704, "WAPE (%)": 9.61, "sMAPE (%)": 20.19}
            ]),
            "certification_status": "PASS WITH LIMITATIONS",
            "limitations_disclaimer": "Track B WAPE (2.80%) reflects synthetic candidate extension evaluation and must NOT be cited as verified real-world forecasting accuracy. Track A WAPE (20.01%) represents true baseline performance on official NCRB data."
        },
        {
            "model_id": "ISOLATION_FOREST_ANOMALY",
            "model_name": "IsolationForest Anomaly Detector",
            "task": "Statistical Anomaly Detection",
            "version": "ANVESHA_V2_AUDITED",
            "training_period": "2002-2017",
            "test_period": "2021-2023",
            "test_metrics": {
                "train_observations": 2517,
                "test_observations": 639,
                "anomalies_detected": 24,
                "anomaly_rate_pct": 3.76
            },
            "certification_status": "PASS WITH LIMITATIONS",
            "limitations_disclaimer": "Aggregate anomalies are statistical volume trajectory flags, not evidence of individual wrongdoing or official misconduct."
        },
        {
            "model_id": "RANDOM_FOREST_TREND_CLASSIFIER",
            "model_name": "RandomForest Trend Classifier",
            "task": "Trend Classification",
            "version": "ANVESHA_V2_AUDITED",
            "training_period": "2002-2017",
            "test_period": "2021-2023",
            "test_metrics": {
                "accuracy": 0.6651,
                "macro_f1": 0.4798,
                "test_observations": 639
            },
            "certification_status": "PASS WITH LIMITATIONS",
            "limitations_disclaimer": "Evaluated on candidate extended panel (2021-2023)."
        }
    ]

    return {
        "certification_status": "PASS WITH LIMITATIONS",
        "total_models": len(models_list),
        "models": models_list
    }


import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_models_provenance_and_dual_track_separation():
    """Verify that /api/v1/models clearly separates Track A and Track B evaluations."""
    response = client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert data["certification_status"] == "PASS WITH LIMITATIONS"
    
    models = data["models"]
    forecasting_model = next((m for m in models if m.get("model_id") in ["PREVIOUS_YEAR_BASELINE", "3_YEAR_ROLLING_MEAN_BASELINE"]), None)
    assert forecasting_model is not None
    
    # Check Track A & Track B separation
    track_a = forecasting_model.get("track_a_official_evaluation")
    track_b = forecasting_model.get("track_b_extended_evaluation")
    assert track_a is not None
    assert track_b is not None
    
    assert track_a["WAPE_pct"] == 20.01
    assert track_a["MAE"] == 244.75
    assert track_a["source_provenance"] == "100% Official NCRB Data"
    
    assert track_b["WAPE_pct"] == 2.80
    assert track_b["MAE"] == 31.21
    assert "Candidate Synthetic Extension" in track_b["source_provenance"]
    
    assert "limitations_disclaimer" in forecasting_model
    assert "2.80%" in forecasting_model["limitations_disclaimer"]

def test_forecast_provenance_and_calendar_lags():
    """Verify forecast endpoint returns status, input provenance, and evaluation summaries."""
    response = client.get("/api/v1/forecast?district=CHENNAI&crime_category=PROPERTY_CRIME&year=2024")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["predicted_count"] is not None
    assert "input_provenance" in data
    assert "lags_used" in data
    assert data["lags_used"]["lag_1_year"] == 2023
    assert data["lags_used"]["lag_2_year"] == 2022
    assert data["lags_used"]["lag_3_year"] == 2021
    
    # Ensure Track A and Track B are present in evaluation_summary
    eval_summary = data.get("evaluation_summary", {})
    assert "track_a_official" in eval_summary
    assert "track_b_extended" in eval_summary

def test_forecast_missing_history_safeguard():
    """Verify forecast returns INSUFFICIENT_HISTORY when preceding historical years are missing."""
    # Request a year where t-3 (1999) and t-2 (2000) are missing
    response = client.get("/api/v1/forecast?district=CHENNAI&crime_category=PROPERTY_CRIME&year=2002")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "INSUFFICIENT_HISTORY"
    assert data["predicted_count"] is None
    assert "Forecast unavailable: Missing required preceding calendar year observation" in data["status_message"]


def test_anomaly_legal_disclaimer_and_provenance():
    """Verify anomaly API attaches legal disclaimers and provenance types."""
    response = client.get("/api/v1/anomalies?district=CHENNAI")
    assert response.status_code == 200
    data = response.json()
    assert "anomalies" in data
    assert len(data["anomalies"]) > 0
    
    first_item = data["anomalies"][0]
    assert "legal_disclaimer" in first_item
    assert "NOT evidence of individual wrongdoing" in first_item["legal_disclaimer"]
    assert "data_type" in first_item
    assert first_item["data_type"] == "STATISTICAL_ANOMALY_FLAG"
    assert "provenance_type" in first_item

def test_trend_eligibility_and_provenance():
    """Verify trend API attaches trend eligibility reasons and provenance types."""
    response = client.get("/api/v1/trends?district=CHENNAI")
    assert response.status_code == 200
    data = response.json()
    assert "trends" in data
    assert len(data["trends"]) > 0
    
    first_item = data["trends"][0]
    assert "trend_eligibility_reason" in first_item
    assert "trend_eligible" in first_item
    assert "data_type" in first_item
    assert first_item["data_type"] == "DERIVED_STATISTIC"

def test_analytics_summary_provenance_breakdown():
    """Verify analytics summary distinguishes official observed from synthetic candidate count."""
    response = client.get("/api/v1/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["certification_status"] == "PASS WITH LIMITATIONS"
    summary_data = data.get("data", {})
    assert summary_data["provenance_breakdown"]["official_observed_count"] >= 2640
    assert summary_data["provenance_breakdown"]["synthetic_candidate_count"] >= 1917

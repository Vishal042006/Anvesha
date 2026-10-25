import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_regression_forecast_category_isolation():
    """Verify that /api/v1/forecast returns distinct category forecasts and no ALL_CRIME leakage."""
    res_all = client.get("/api/v1/forecast?district=Chennai&crime_category=ALL_CRIME&year=2026")
    assert res_all.status_code == 200
    data_all = res_all.json()
    all_count = data_all.get("predicted_count")
    assert all_count is not None
    assert all_count > 30000.0, f"Expected Chennai ALL_CRIME forecast > 30k, got {all_count}"

    res_theft = client.get("/api/v1/forecast?district=Chennai&crime_category=THEFT&year=2026")
    assert res_theft.status_code == 200
    data_theft = res_theft.json()
    theft_count = data_theft.get("predicted_count")
    assert theft_count is not None
    assert theft_count < 15000.0, f"Chennai THEFT forecast leaked ALL_CRIME volume! Got {theft_count}"
    assert theft_count != all_count, "Theft forecast must be distinct from ALL_CRIME forecast!"
    assert data_theft.get("latest_observed_value") == 5977.0, f"Expected latest obs 5977.0, got {data_theft.get('latest_observed_value')}"
    assert data_theft.get("lower_bound") is not None
    assert data_theft.get("upper_bound") is not None
    assert data_theft["lower_bound"] < theft_count < data_theft["upper_bound"]

    res_burg = client.get("/api/v1/forecast?district=Chennai&crime_category=BURGLARY&year=2026")
    assert res_burg.status_code == 200
    data_burg = res_burg.json()
    burg_count = data_burg.get("predicted_count")
    assert burg_count is not None
    assert burg_count < theft_count, f"Burglary volume should be less than theft, got {burg_count} vs {theft_count}"


def test_regression_spatial_category_grounding():
    """Verify that /api/v1/spatial/map yields real category-specific observations across years."""
    # 2023 Theft
    res_theft_2023 = client.get("/api/v1/spatial/map?year=2023&crime_category=THEFT&metric=crime_count")
    assert res_theft_2023.status_code == 200
    feats_theft = res_theft_2023.json().get("features", [])
    ch_theft = next((f for f in feats_theft if f["properties"]["name"] == "Chennai"), None)
    assert ch_theft is not None
    assert ch_theft["properties"]["crime_count"] == 5977, f"Expected 5977 theft cases for Chennai in 2023, got {ch_theft['properties']['crime_count']}"

    # 2023 All Crime
    res_all_2023 = client.get("/api/v1/spatial/map?year=2023&crime_category=ALL_CRIME&metric=crime_count")
    assert res_all_2023.status_code == 200
    feats_all = res_all_2023.json().get("features", [])
    ch_all = next((f for f in feats_all if f["properties"]["name"] == "Chennai"), None)
    assert ch_all is not None
    assert ch_all["properties"]["crime_count"] == 54272, f"Expected 54272 total cases for Chennai in 2023, got {ch_all['properties']['crime_count']}"

    # 2020 Theft
    res_theft_2020 = client.get("/api/v1/spatial/map?year=2020&crime_category=THEFT&metric=crime_count")
    assert res_theft_2020.status_code == 200
    feats_theft_2020 = res_theft_2020.json().get("features", [])
    ch_theft_2020 = next((f for f in feats_theft_2020 if f["properties"]["name"] == "Chennai"), None)
    assert ch_theft_2020 is not None
    assert ch_theft_2020["properties"]["crime_count"] == 4374, f"Expected 4374 theft cases for Chennai in 2020, got {ch_theft_2020['properties']['crime_count']}"


def test_regression_anomaly_no_hardcoded_dummy():
    """Verify that /api/v1/anomalies never returns the fake 1950.0/1800.0 fallback record."""
    res = client.get("/api/v1/anomalies?district=Chennai&crime_category=THEFT")
    assert res.status_code == 200
    data = res.json()
    anomalies = data.get("anomalies", [])
    for a in anomalies:
        # None of the anomalies should match the fake fallback signature
        is_fake = (a.get("observed") == 1950.0 and a.get("expected") == 1800.0 and a.get("difference") == 150.0)
        assert not is_fake, "Hardcoded fake anomaly fallback detected in API output!"


def test_regression_explanation_uncertainty_limitations():
    """Verify that /api/v1/explain returns dynamic uncertainty limitations and category context."""
    res = client.get("/api/v1/explain/Chennai?category=THEFT")
    assert res.status_code == 200
    data = res.json()
    assert "uncertainty_limitations" in data
    assert len(data["uncertainty_limitations"]) > 10
    assert "context_id" in data
    assert "THEFT" in data["context_id"]
    assert "evidence_used" in data
    assert len(data["evidence_used"]) >= 5


def test_regression_research_domain_anchoring():
    """Verify that /api/v1/research/search prioritizes criminological and policing papers."""
    res = client.get("/api/v1/research/search?query=Chennai+Theft")
    assert res.status_code == 200
    data = res.json()
    papers = data.get("papers", [])
    assert len(papers) > 0
    # Top paper should NOT be an unanchored genetics or biomedical paper
    top_title = (papers[0].get("title") or "").lower()
    assert "neural genetic regulatory" not in top_title, "Irrelevant genetics paper ranked #1 for theft!"

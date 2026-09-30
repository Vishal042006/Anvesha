from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_models():
    res = client.get("/api/v1/models")
    assert res.status_code == 200
    data = res.json()
    assert "models" in data
    assert len(data["models"]) > 0

def test_forecast():
    res = client.get("/api/v1/forecast?district=CHENNAI&crime_category=PROPERTY_CRIME&year=2024")
    assert res.status_code == 200
    data = res.json()
    assert data["district"] == "CHENNAI"
    assert "predicted_count" in data

def test_anomalies():
    res = client.get("/api/v1/anomalies?district=CHENNAI")
    assert res.status_code == 200
    data = res.json()
    assert "anomalies" in data

def test_trends():
    res = client.get("/api/v1/trends?district=CHENNAI")
    assert res.status_code == 200
    data = res.json()
    assert "trends" in data

def test_spatial():
    res = client.get("/api/v1/spatial/crime")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"

def test_evidence():
    res = client.get("/api/v1/evidence/search?q=crime")
    assert res.status_code == 200
    data = res.json()
    assert "results" in data

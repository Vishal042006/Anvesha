"""
================================================================================
TEST SUITE: DISTRICT INTELLIGENCE BRIEFING & EVIDENCE SYNTHESIS
================================================================================
Verifies requirements:
1. Chennai — All Crime — 2023
2. Chennai — Theft — 2023
3. Chennai — Burglary — 2023
4. Coimbatore — Theft — 2023
5. Madurai — Theft — 2023
6. Kanchipuram — Theft — 2023
7. Chennai — Theft — 2016 (historical cutoff filtering)
8. Missing or insufficient crime data handling
9. Cutoff year news filtering (no future news relative to cutoff year)
10. Research metadata verification & citations [1], [2]
11. Union Territory (Puducherry / Karaikal) routing
12. Strict like-for-like category isolation (counts not mixed)
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_briefing_chennai_all_crime_2023():
    res = client.get("/api/v1/briefing/district?district=Chennai&category=ALL_CRIME&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    ctx = data["context"]
    assert ctx["district"] == "Chennai"
    assert ctx["category"] == "ALL_CRIME"
    assert ctx["cutoff_year"] == 2023
    assert ctx["population"] == 4647000
    
    obs = data["observed_pattern"]
    assert not obs["is_missing"]
    assert obs["latest_year"] == 2023
    assert obs["latest_count"] == 54272
    assert obs["crime_rate_pct"] > 0
    assert "District Crime Rate" in obs["formula"]
    
    comp = data["historical_comparison"]
    assert comp["prev_year"] == 2022
    assert comp["prev_count"] == 47051
    assert comp["abs_change"] == 7221
    assert comp["pct_change"] == 15.3
    assert comp["pct_change_valid"] is True
    
    # Evidence Quality rating
    assert data["evidence_quality"]["overall_rating"] in ["Strong evidence", "Limited evidence"]
    assert len(data["research_evidence"]["studies"]) >= 2
    assert "[1]" in data["interpretation"]["interpretation"]


def test_briefing_chennai_theft_isolation_2023():
    res = client.get("/api/v1/briefing/district?district=Chennai&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    obs = data["observed_pattern"]
    assert obs["latest_count"] == 5977
    assert obs["latest_year"] == 2023
    assert obs["latest_count"] != 54272, "Theft count must never equal ALL_CRIME count!"
    
    comp = data["historical_comparison"]
    assert comp["prev_year"] == 2022
    assert comp["prev_count"] == 5104
    assert comp["pct_change"] == 17.1


def test_briefing_chennai_burglary_isolation_2023():
    res = client.get("/api/v1/briefing/district?district=Chennai&category=BURGLARY&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    obs = data["observed_pattern"]
    assert obs["latest_count"] == 1541
    assert obs["latest_year"] == 2023
    assert obs["latest_count"] != 5977, "Burglary count must be isolated from Theft!"


def test_briefing_coimbatore_theft_2023():
    res = client.get("/api/v1/briefing/district?district=Coimbatore&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    assert data["context"]["district"] == "Coimbatore"
    obs = data["observed_pattern"]
    assert obs["latest_count"] == 1816
    assert data["historical_comparison"]["prev_count"] == 1585


def test_briefing_madurai_theft_2023():
    res = client.get("/api/v1/briefing/district?district=Madurai&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    assert data["context"]["district"] == "Madurai"
    obs = data["observed_pattern"]
    assert obs["latest_count"] == 1287
    assert data["historical_comparison"]["prev_count"] == 1194


def test_briefing_kanchipuram_theft_2023():
    res = client.get("/api/v1/briefing/district?district=Kanchipuram&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    assert data["context"]["district"] == "Kanchipuram"
    obs = data["observed_pattern"]
    assert obs["latest_count"] == 3320
    assert data["historical_comparison"]["prev_count"] == 2951


def test_briefing_chennai_theft_historical_cutoff_2016():
    res = client.get("/api/v1/briefing/district?district=Chennai&category=THEFT&year=2016")
    assert res.status_code == 200
    data = res.json()
    
    obs = data["observed_pattern"]
    assert obs["latest_year"] == 2016
    assert obs["latest_count"] == 2800
    assert data["historical_comparison"]["prev_year"] == 2015
    assert data["historical_comparison"]["prev_count"] == 2443
    
    # News must respect cutoff year: live 2024-2026 news must NOT be presented as 2016 evidence
    news = data["local_news"]
    assert news["cutoff_year_applied"] == 2016
    assert len(news["local_articles"]) == 0
    assert news["has_local"] is False


def test_briefing_union_territory_puducherry():
    res = client.get("/api/v1/briefing/district?district=Puducherry&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    ctx = data["context"]
    assert ctx["is_union_territory"] is True
    assert "Puducherry" in ctx["state_ut"]
    assert data["observed_pattern"]["latest_count"] == 901
    
    # Check verified police contact for Puducherry
    contacts = data["safety_guidance"]["local_contact"]
    assert "0413" in contacts["control_room"] or "112" in contacts["emergency"]


def test_briefing_missing_district_handling():
    res = client.get("/api/v1/briefing/district?district=UnknownDistrictXYZ&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    obs = data["observed_pattern"]
    assert obs["is_missing"] is True
    assert "No validated observation is available" in obs["missing_reason"]
    assert data["historical_comparison"]["pct_change_valid"] is False
    assert data["evidence_quality"]["overall_rating"] in ["Limited evidence", "Inconclusive"]


def test_briefing_public_safety_contacts_and_advisories():
    res = client.get("/api/v1/briefing/district?district=Chennai&category=THEFT&year=2023")
    assert res.status_code == 200
    data = res.json()
    
    safety = data["safety_guidance"]
    assert "local_contact" in safety
    assert "044" in safety["local_contact"]["control_room"]
    assert len(safety["district_specific"]) > 0
    assert any("LHMS" in g["guidance"] or "Locked House" in g["guidance"] for g in safety["district_specific"])
    assert any("112" in g["guidance"] for g in safety["general_guidance"])
    assert safety["general_disclaimer"] == "General guidance — not a district-specific risk assessment."

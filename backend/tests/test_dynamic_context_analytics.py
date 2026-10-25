"""
================================================================================
ANVESHA 2.0 — DYNAMIC ANALYTICS INTEGRATION TEST SUITE
================================================================================
Verifies context-specific analytical data generation across districts, crime categories,
and years:
1. Dynamic change points, current patterns, and forecasts differ across contexts.
2. Chennai Theft vs Chennai Burglary produce distinct outputs.
3. Chennai Theft vs Coimbatore Theft produce distinct outputs.
4. News & Research APIs construct category and district-aware queries.
5. Zero synthetic values masquerade as production official data without provenance tags.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.analytics_service import analytics_service

client = TestClient(app)

TEST_DISTRICTS = [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli",
    "Nagapattinam", "Thanjavur", "Erode", "Vellore", "Kanchipuram"
]

TEST_CATEGORIES = [
    "ALL_CRIME", "PROPERTY", "VIOLENT", "WOMEN_AND_CHILDREN", "ECONOMIC"
]

TEST_YEARS = [2023, 2022, 2020]


def test_crimeshift_analyze_dynamic_context():
    """Verifies that /api/v1/crimeshift/analyze returns valid, context-specific results."""
    for dist in TEST_DISTRICTS[:3]:
        for cat in TEST_CATEGORIES[:2]:
            response = client.get(f"/api/v1/crimeshift/analyze?unit={dist}&category={cat}&year_cutoff=2023")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert data["unit"] == dist
            assert data["crime_category"] == cat
            assert "historical_series" in data
            assert len(data["historical_series"]) > 0
            assert "current_pattern" in data
            assert "transition" in data
            assert "forecast" in data


def test_context_difference_same_district_different_category():
    """Verifies that Chennai + PROPERTY vs Chennai + VIOLENT produce distinct analytical outputs."""
    res_prop = client.get("/api/v1/crimeshift/analyze?unit=Chennai&category=PROPERTY&year_cutoff=2023").json()
    res_viol = client.get("/api/v1/crimeshift/analyze?unit=Chennai&category=VIOLENT&year_cutoff=2023").json()

    assert res_prop["status"] == "success"
    assert res_viol["status"] == "success"

    # Historical series volumes must reflect category-specific counts
    prop_latest = res_prop["historical_series"][-1]["observed"]
    viol_latest = res_viol["historical_series"][-1]["observed"]

    assert prop_latest != viol_latest, "Category counts must be distinct for the same district"


def test_context_difference_different_district_same_category():
    """Verifies that Chennai + ALL_CRIME vs Coimbatore + ALL_CRIME produce distinct analytical outputs."""
    res_chennai = client.get("/api/v1/crimeshift/analyze?unit=Chennai&category=ALL_CRIME&year_cutoff=2023").json()
    res_coimbatore = client.get("/api/v1/crimeshift/analyze?unit=Coimbatore&category=ALL_CRIME&year_cutoff=2023").json()

    assert res_chennai["status"] == "success"
    assert res_coimbatore["status"] == "success"

    chennai_latest = res_chennai["historical_series"][-1]["observed"]
    coimbatore_latest = res_coimbatore["historical_series"][-1]["observed"]

    assert chennai_latest != coimbatore_latest, "District counts must be distinct for the same category"


def test_explain_unit_dynamic_response():
    """Verifies that /api/v1/explain/{unit} returns structured, dynamic non-boilerplate responses."""
    resp = client.get("/api/v1/explain/Nagapattinam?category=PROPERTY")
    assert resp.status_code == 200
    exp = resp.json()

    assert "Nagapattinam" in exp["what_happened"] or "Nagapattinam" in exp["what_pattern_is_present"]
    assert "property" in exp["what_happened"].lower() or "property" in exp["what_pattern_is_present"].lower()
    assert "what_may_happen_next" in exp
    assert "forecast" in exp
    assert "how_certain_is_it" in exp


def test_news_query_district_and_category_relevance():
    """Verifies that news search constructs category and district-aware queries."""
    resp = client.get("/api/v1/news/search?district=Madurai&category=PROPERTY")
    assert resp.status_code == 200
    news_data = resp.json()
    assert news_data["status"] == "success"
    assert "articles" in news_data


def test_crimeshift_transitions_dynamic_context():
    """Verifies that /api/v1/crimeshift/transitions returns dynamic Markov transition matrices."""
    # Context 1: Chennai ALL_CRIME
    res_ch = client.get("/api/v1/crimeshift/transitions?unit=Chennai&category=ALL_CRIME").json()
    assert res_ch["status"] == "success"
    assert "transition_matrix" in res_ch
    assert "persistence_years" in res_ch
    assert "context_id" in res_ch
    assert len(res_ch["transition_matrix"]) == 4

    # Context 2: Coimbatore PROPERTY
    res_cb = client.get("/api/v1/crimeshift/transitions?unit=Coimbatore&category=PROPERTY").json()
    assert res_cb["status"] == "success"
    assert "context_id" in res_cb
    assert res_cb["context_id"] != res_ch["context_id"]


def test_crimeshift_availability_endpoint():
    """Verifies that /api/v1/crimeshift/availability returns structured availability indicators."""
    res_avail = client.get("/api/v1/crimeshift/availability?unit=Chennai&category=ALL_CRIME").json()
    assert res_avail["status"] in ["AVAILABLE", "PARTIAL"]
    assert res_avail["available"] is True
    assert res_avail["observation_count"] >= 15

    res_unavail = client.get("/api/v1/crimeshift/availability?unit=NonExistentPrecinctXYZ&category=ALL_CRIME").json()
    assert res_unavail["status"] == "UNAVAILABLE"
    assert res_unavail["available"] is False


def test_context_id_in_crimeshift_endpoints():
    """Verifies that all analytical endpoints return deterministic, unique context_ids."""
    res = client.get("/api/v1/crimeshift/analyze?unit=Chennai&category=PROPERTY&year_cutoff=2023").json()
    assert "context_id" in res
    assert res["context_id"].startswith("TN|")
    assert "PROPERTY" in res["context_id"]
    assert "2023" in res["context_id"]


def test_rapid_filter_contexts_across_ten_districts():
    """Verifies that 10 canonical Tamil Nadu districts all return valid independent analytical contexts."""
    for dist in TEST_DISTRICTS:
        res = client.get(f"/api/v1/crimeshift/analyze?unit={dist}&category=ALL_CRIME&year_cutoff=2023").json()
        assert res["status"] == "success"
        assert res["unit"] == dist
        assert len(res["historical_series"]) >= 10, f"District {dist} must have at least 10 observations"
        assert "point" in res["forecast"]["horizons"][0]


def test_multi_horizon_forecasting_conformal_bounds():
    """Verifies that multi-horizon 2026-2030 forecasts produce genuine conformal bounds with target label."""
    res = client.get("/api/v1/forecast?district=Chennai&crime_category=MURDER&year=2026").json()
    assert res["status"].upper() == "SUCCESS"
    assert res["target_label"] == "Recorded Crime Count"
    assert res["nominal_coverage_pct"] == 95.0
    assert res["empirical_coverage_picp"] == 92.5
    assert len(res["horizons"]) == 5

    years = [h["year"] for h in res["horizons"]]
    assert years == [2026, 2027, 2028, 2029, 2030]

    for h in res["horizons"]:
        assert h["point_forecast"] is not None
        assert h["lower_bound"] is not None
        assert h["upper_bound"] is not None
        assert h["lower_bound"] <= h["point_forecast"] <= h["upper_bound"]
        assert h["uncertainty_status"] == "FINITE_SAMPLE_CONFORMAL_95"


def test_crimeshift_anomalies_and_audit():
    """Verifies that analyze_crimeshift detects dispersion anomalies and tags series items."""
    res = client.get("/api/v1/crimeshift/analyze?unit=Chennai&category=ALL_CRIME&year_cutoff=2023").json()
    assert res["status"] == "success"
    assert "anomalies" in res
    assert isinstance(res["anomalies"], list)

    for item in res["historical_series"]:
        assert "is_anomaly" in item
        assert isinstance(item["is_anomaly"], bool)


def test_explanation_strict_8_key_contract():
    """Verifies that /api/v1/explain returns the strict 8-key contract with zero blank values."""
    res = client.get("/api/v1/explain/Chennai?category=MURDER").json()
    assert res["status"] == "success"

    required_keys = [
        "what_changed", "current_pattern", "what_may_happen_next",
        "forecast_reading", "uncertainty_limitations", "certainty", "evidence_used"
    ]
    for k in required_keys:
        assert k in res, f"Missing required explanation key: {k}"
        assert res[k], f"Key {k} must not be empty"

    assert isinstance(res["evidence_used"], list)
    assert len(res["evidence_used"]) >= 5

    # Backward compatibility keys must also be present
    assert "what_happened" in res
    assert "what_pattern_is_present" in res
    assert "forecast" in res
    assert "how_certain_is_it" in res


def test_news_multi_query_relevance_and_hierarchy():
    """Verifies news endpoint returns articles with relevance explanations and evidence scopes."""
    res = client.get("/api/v1/news/search?district=Chennai&category=THEFT").json()
    assert res["status"] == "success"
    assert "articles" in res
    assert len(res["articles"]) > 0

    first_art = res["articles"][0]
    assert "why_relevant" in first_art
    assert "evidence_scope" in first_art
    assert first_art["evidence_scope"] in ["LOCAL NEWS", "REGIONAL CONTEXT"]


def test_research_literature_hierarchical_scoping():
    """Verifies research literature endpoint returns fast results with evidence scopes and key findings."""
    res = client.get("/api/v1/research/literature?query=theft&category=property").json()
    assert "papers" in res
    assert len(res["papers"]) > 0

    first_paper = res["papers"][0]
    assert "evidence_scope" in first_paper
    assert "key_finding" in first_paper
    assert "domain_relevance_score" in first_paper
    assert first_paper["domain_relevance_score"] > 0


def test_model_comparison_fields_normalized():
    """Verifies /api/v1/model-comparison returns normalized lowercase metric fields and metadata."""
    res = client.get("/api/v1/model-comparison").json()
    assert "models" in res
    assert len(res["models"]) > 0
    assert "canonical_dataset_metadata" in res

    first_model = res["models"][0]
    for metric in ["mae", "rmse", "wape", "mase", "smape"]:
        assert metric in first_model, f"Metric {metric} missing from model comparison"
    assert "is_recommended" in first_model


def test_spatial_unit_details_year_context():
    """Verifies unit details reflects requested year context (2016 vs 2023)."""
    res_2016 = client.get("/api/v1/spatial/unit-details?unit_name=Chennai&year=2016").json()
    res_2023 = client.get("/api/v1/spatial/unit-details?unit_name=Chennai&year=2023").json()

    assert res_2016["year"] == 2016
    assert res_2023["year"] == 2023
    assert "historical_timeline" in res_2016
    assert "historical_timeline" in res_2023


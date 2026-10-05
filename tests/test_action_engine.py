import pytest
from backend.research.action_engine import (
    ActionableCrimeFinding,
    EvidenceRecord,
    TangibleActionEngine,
    tangible_action_engine
)


def test_actionable_crime_finding_calculation():
    finding = ActionableCrimeFinding(
        district="Coimbatore",
        crime_category="PROPERTY_CRIME",
        period="2022-2023",
        observed_count=184,
        baseline_count=145,
        population=1450000,
        geography_level="district"
    )

    d = finding.to_dict()
    assert d["district"] == "Coimbatore"
    assert d["change_amount"] == 39.0
    assert d["change_percent"] == 26.9
    assert d["trend"] == "increasing"
    assert d["confidence"] == "high"
    assert d["rate_per_100k"] == 12.69
    assert d["baseline_rate_per_100k"] == 10.0


def test_evaluate_actionability_rejection():
    engine = TangibleActionEngine()

    # Small baseline count
    small_finding = ActionableCrimeFinding(
        district="Nilgiris",
        crime_category="BURGLARY",
        period="2022-2023",
        observed_count=3,
        baseline_count=2,
    )
    is_act, reason = engine.evaluate_actionability(small_finding)
    assert not is_act
    assert "too small" in reason

    # Flat trend
    flat_finding = ActionableCrimeFinding(
        district="Salem",
        crime_category="THEFT",
        period="2022-2023",
        observed_count=50,
        baseline_count=49,
    )
    is_act, reason = engine.evaluate_actionability(flat_finding)
    assert not is_act
    assert "within expected historical fluctuation" in reason


def test_generate_targeted_queries():
    engine = TangibleActionEngine()

    v_finding = ActionableCrimeFinding(
        district="Chennai",
        crime_category="VEHICLE_THEFT",
        period="2022-2023",
        observed_count=220,
        baseline_count=160,
    )
    queries = engine.generate_targeted_queries(v_finding)
    assert len(queries) >= 3
    assert any("vehicle theft" in q for q in queries)
    assert any("parking" in q or "target hardening" in q for q in queries)


def test_actionability_levels():
    engine = TangibleActionEngine()

    paper = {
        "title": "Vehicle Theft Prevention in Commercial Parking Facilities",
        "authors": ["R. Clarke", "J. Eck"],
        "year": 2018,
        "doi": "10.1016/j.jcrim.2018.02.004",
        "url": "https://doi.org/10.1016/j.jcrim.2018.02.004",
        "journal": "Criminology & Public Policy",
        "abstract": "Evaluation of access control and situational target hardening in parking precincts.",
        "relevance_score": 0.91,
    }
    evidence = [EvidenceRecord(paper)]

    # District level finding -> LEVEL 2 AREA-TARGETED
    dist_finding = ActionableCrimeFinding(
        district="Madurai",
        crime_category="VEHICLE_THEFT",
        period="2022-2023",
        observed_count=150,
        baseline_count=100,
        geography_level="district"
    )
    rec_dist = engine.build_recommendation(dist_finding, evidence)
    assert rec_dist["actionability_level"] == "LEVEL 2 — AREA-TARGETED"
    assert "Madurai District" in rec_dist["target_area"]

    # Station level finding -> LEVEL 3 LOCATION-TARGETED
    station_finding = ActionableCrimeFinding(
        district="Madurai",
        crime_category="VEHICLE_THEFT",
        period="2022-2023",
        observed_count=40,
        baseline_count=20,
        geography_level="station",
        station_name="Tallakulam PS"
    )
    rec_station = engine.build_recommendation(station_finding, evidence)
    assert rec_station["actionability_level"] == "LEVEL 3 — LOCATION-TARGETED"
    assert "Tallakulam PS" in rec_station["target_area"]


def test_run_action_pipeline_end_to_end():
    params = {
        "district": "Coimbatore",
        "crime_category": "PROPERTY_CRIME",
        "period": "2022-2023",
        "observed_count": 184,
        "baseline_count": 145,
        "population": 1450000,
    }
    result = tangible_action_engine.run_action_pipeline(params)

    assert result["is_actionable"] is True
    assert "finding" in result
    assert "recommendation_object" in result
    assert "public_explanation" in result
    assert "research_record" in result

    pub = result["public_explanation"]
    assert "observed" in pub
    assert "interpretation" in pub
    assert "evidence" in pub
    assert "action" in pub
    assert "limitations" in pub
    assert "sources" in pub

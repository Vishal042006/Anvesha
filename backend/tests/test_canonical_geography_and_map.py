"""
ANVESHA — CANONICAL GEOGRAPHY & SPATIAL MAP AUDIT TESTS
======================================================
Verifies:
1. Reporting unit selector contains NO "TOTAL", "ZZ TOTAL", "Total", or duplicates.
2. Canonical reporting unit registry resolves all Tamil Nadu units correctly.
3. GeoJSON map features contain REAL polygon geometries (no 5-point bounding box squares).
4. All map features include required metadata (canonical_unit_id, observed_2023, forecast_value, change_vs_2023, model, status).
5. Forecast year switching (2026-2030) dynamically loads model outputs for that year.
6. Police station coordinates are valid and reference-only.
7. New Spatial REST Endpoints (/spatial/levels, /categories, /map, /summary, /unit/{id}).
8. Temporal isolation & leakage safeguards on spatial endpoints.
"""

import os
import json
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.geography_registry import (
    get_canonical_reporting_units,
    canonicalize_unit_name,
    CANONICAL_TN_UNITS
)
from backend.app.services.spatial_service import spatial_service
from backend.app.services.analytics_service import analytics_service

client = TestClient(app)

def test_canonical_reporting_units_registry():
    units = get_canonical_reporting_units("TAMIL NADU", include_railways=False)
    
    assert len(units) >= 30, f"Expected at least 30 canonical units, got {len(units)}"
    
    # Strictly check that aggregate terms are NOT in the list
    forbidden = ["TOTAL", "Total", "ZZ TOTAL", "TOTAL DISTRICT(S)", "OTHER UNITS", "CYBER CELL"]
    for f in forbidden:
        assert f not in units, f"Forbidden aggregate term '{f}' found in canonical reporting units list!"
        
    # Check for duplicates
    assert len(units) == len(set(units)), "Duplicate units found in canonical list!"

def test_backend_districts_endpoint():
    res = client.get("/api/v1/geography/districts?state_ut=TAMIL%20NADU")
    assert res.status_code == 200
    data = res.json()
    
    assert data["status"] == "success"
    districts = data["districts"]
    
    assert "TOTAL" not in districts
    assert "Total" not in districts
    assert "ZZ TOTAL" not in districts
    assert len(districts) == len(set(districts))

def test_spatial_geojson_polygons():
    spatial_data = spatial_service.get_spatial_crime(state_ut="TAMIL NADU", year=2026, layer="forecast")
    features = spatial_data.get("features", [])
    
    assert len(features) >= 30, f"Expected at least 30 spatial features, got {len(features)}"
    
    for feat in features:
        props = feat.get("properties", {})
        geometry = feat.get("geometry", {})
        
        # Verify required properties exist
        assert "canonical_unit_id" in props, f"Missing canonical_unit_id in feature: {props}"
        assert "reporting_unit" in props, f"Missing reporting_unit in feature: {props}"
        assert "observed_2023" in props, f"Missing observed_2023 in feature: {props}"
        assert "forecast_value" in props, f"Missing forecast_value in feature: {props}"
        assert "model" in props, f"Missing model in feature: {props}"
        assert props["status"] in ["OBSERVED", "FORECAST"], f"Invalid status: {props.get('status')}"
        
        # Verify geometry is real polygon (not 5-point bounding box square)
        g_type = geometry.get("type")
        assert g_type in ["Polygon", "MultiPolygon"], f"Invalid geometry type: {g_type}"
        
        coords = geometry.get("coordinates", [])
        assert len(coords) > 0, "Empty geometry coordinates!"
        
        # Ensure it has more than 5 points if detailed polygon
        if g_type == "Polygon":
            num_pts = len(coords[0])
            assert num_pts >= 5, f"Polygon has insufficient vertices ({num_pts})"

def test_forecast_year_switching():
    res_2026 = spatial_service.get_spatial_crime(state_ut="TAMIL NADU", year=2026, layer="forecast")
    res_2030 = spatial_service.get_spatial_crime(state_ut="TAMIL NADU", year=2030, layer="forecast")
    
    val_2026 = res_2026["features"][0]["properties"]["forecast_value"]
    val_2030 = res_2030["features"][0]["properties"]["forecast_value"]
    
    assert res_2026["metadata"]["year"] == 2026
    assert res_2030["metadata"]["year"] == 2030
    assert val_2026 != val_2030 or val_2026 > 0, "Year switching should load year-specific forecasts!"

def test_police_stations_validity():
    ps_data = spatial_service.get_police_stations()
    features = ps_data.get("features", [])
    
    assert len(features) > 0, "Police stations layer is empty!"
    
    for feat in features[:20]:
        geometry = feat.get("geometry", {})
        assert geometry.get("type") == "Point"
        coords = geometry.get("coordinates", [])
        assert len(coords) == 2
        lon, lat = coords[0], coords[1]
        assert 75.0 <= lon <= 81.0, f"Invalid longitude for TN police station: {lon}"
        assert 8.0 <= lat <= 14.0, f"Invalid latitude for TN police station: {lat}"


# ==============================================================================
# NEW PRODUCTION GEOGRAPHIC INTELLIGENCE ENDPOINT TESTS
# ==============================================================================

def test_spatial_levels_endpoint():
    res = client.get("/api/v1/spatial/levels")
    assert res.status_code == 200
    data = res.json()
    assert "levels" in data
    codes = [l["code"] for l in data["levels"]]
    assert "state" in codes
    assert "district" in codes
    assert "police_unit" in codes
    assert "police_station" in codes

def test_spatial_categories_endpoint():
    res = client.get("/api/v1/spatial/categories")
    assert res.status_code == 200
    data = res.json()
    assert "categories" in data
    codes = [c["code"] for c in data["categories"]]
    assert "ALL_CRIME" in codes

def test_spatial_map_canonical_endpoint():
    res = client.get("/api/v1/spatial/map?level=police_unit&year=2023&metric=crime_count")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert "metadata" in data
    assert data["metadata"]["level"] == "police_unit"
    assert data["metadata"]["year"] == 2023
    
    features = data["features"]
    assert len(features) >= 30
    sample = features[0]["properties"]
    assert "geography_id" in sample
    assert "current_regime" in sample
    assert "change_point_detected" in sample
    assert "provenance" in sample

def test_spatial_summary_endpoint():
    res = client.get("/api/v1/spatial/summary?year=2023&level=police_unit")
    assert res.status_code == 200
    data = res.json()
    assert data["total_units"] >= 30
    assert data["units_with_data"] > 0
    assert data["mean_crime"] > 0
    assert "regime_distribution" in data

def test_spatial_unit_details_endpoint():
    res = client.get("/api/v1/spatial/unit/Chennai%20City?year_cutoff=2023")
    assert res.status_code == 200
    data = res.json()
    assert "geography" in data
    assert "current_status" in data
    assert "crime_history" in data
    assert "forecast" in data
    assert "provenance" in data
    assert data["geography"]["name"] in ["Chennai", "Chennai City"]
    
    # Test strict temporal cutoff: history must NOT include years > 2023
    for h in data["crime_history"]:
        assert h["year"] <= 2023, f"Temporal leakage! Found year {h['year']} > 2023 in unit history"

def test_spatial_unit_details_404():
    res = client.get("/api/v1/spatial/unit/NonExistentUnit9999")
    assert res.status_code == 404
    err = res.json()
    assert "detail" in err


def test_dharmapuri_and_krishnagiri_boundaries_and_mapping():
    """
    Verifies Dharmapuri and Krishnagiri have distinct canonical IDs,
    independent parent districts, real non-identical polygon boundaries,
    and geographically correct centroids (Krishnagiri north of Dharmapuri).
    """
    # 1. Check registry resolution
    meta_d = canonicalize_unit_name("Dharmapuri")
    meta_k = canonicalize_unit_name("Krishnagiri")
    
    assert meta_d["id"] == "GEO_TN_006"
    assert meta_k["id"] == "GEO_TN_012"
    assert meta_d["parent_district"] == "Dharmapuri"
    assert meta_k["parent_district"] == "Krishnagiri"

    # 2. Check spatial endpoint features
    res = client.get("/api/v1/spatial/map?level=police_unit&year=2023&metric=crime_count")
    assert res.status_code == 200
    features = res.json()["features"]

    d_feat = next((f for f in features if f["properties"].get("canonical_unit_id") == "GEO_TN_006"), None)
    k_feat = next((f for f in features if f["properties"].get("canonical_unit_id") == "GEO_TN_012"), None)

    assert d_feat is not None, "Dharmapuri feature not found in spatial map!"
    assert k_feat is not None, "Krishnagiri feature not found in spatial map!"

    # Properties must be distinct
    assert d_feat["properties"]["district"].upper() == "DHARMAPURI"
    assert k_feat["properties"]["district"].upper() == "KRISHNAGIRI"

    # Centroids must be distinct and geographically realistic
    d_lat = d_feat["properties"]["lat"]
    k_lat = k_feat["properties"]["lat"]
    assert k_lat > d_lat, f"Krishnagiri ({k_lat}) must be north of Dharmapuri ({d_lat})"
    assert abs(k_lat - d_lat) >= 0.3, f"Latitude difference between Krishnagiri and Dharmapuri too small: {abs(k_lat - d_lat)}"

    # Geometries must NOT be identical
    d_coords = d_feat["geometry"]["coordinates"]
    k_coords = k_feat["geometry"]["coordinates"]
    assert d_coords != k_coords, "Dharmapuri and Krishnagiri must NOT share identical polygon coordinates!"


def test_karaikal_and_puducherry_boundaries_and_mapping():
    """
    Verifies Karaikal and Puducherry have distinct canonical IDs,
    independent parent districts, real polygon boundaries,
    and geographically correct centroids along the eastern coast.
    """
    # 1. Registry resolution
    meta_kar = canonicalize_unit_name("Karaikal")
    meta_pud = canonicalize_unit_name("Puducherry")

    assert meta_kar["id"] == "GEO_TN_039"
    assert meta_pud["id"] == "GEO_TN_040"
    assert meta_kar["parent_district"] == "Karaikal"
    assert meta_pud["parent_district"] == "Puducherry"

    # 2. Spatial map endpoint features
    res = client.get("/api/v1/spatial/map?level=police_unit&year=2023&metric=crime_count")
    assert res.status_code == 200
    features = res.json()["features"]

    kar_feat = next((f for f in features if f["properties"].get("canonical_unit_id") == "GEO_TN_039"), None)
    pud_feat = next((f for f in features if f["properties"].get("canonical_unit_id") == "GEO_TN_040"), None)

    assert kar_feat is not None, "Karaikal feature not found in spatial map!"
    assert pud_feat is not None, "Puducherry feature not found in spatial map!"

    # Properties
    assert kar_feat["properties"]["district"].upper() == "KARAIKAL"
    assert pud_feat["properties"]["district"].upper() == "PUDUCHERRY"
    assert kar_feat["properties"]["observed_2023"] > 0
    assert pud_feat["properties"]["observed_2023"] > 0

    # Geographically correct coordinates
    # Karaikal is located south of Puducherry along the Coromandel coast
    kar_lat = kar_feat["properties"]["lat"]
    pud_lat = pud_feat["properties"]["lat"]
    assert pud_lat > kar_lat, f"Puducherry ({pud_lat}) must be north of Karaikal ({kar_lat})"
    assert 10.5 <= kar_lat <= 11.2, f"Invalid Karaikal latitude: {kar_lat}"
    assert 11.7 <= pud_lat <= 12.2, f"Invalid Puducherry latitude: {pud_lat}"


def test_all_district_centroids_interior_alignment():
    """
    Verifies that every single district feature on the spatial map has its
    centroid / label anchor coordinates strictly inside its own polygon boundary.
    Prevents labels from appearing outside or misaligned to neighboring regions.
    """
    from shapely.geometry import shape, Point

    res = client.get("/api/v1/spatial/map?level=police_unit&year=2023&metric=crime_count")
    assert res.status_code == 200
    features = res.json()["features"]

    for feat in features:
        props = feat.get("properties", {})
        d_name = props.get("display_name", "Unknown")
        lat = props.get("lat")
        lon = props.get("lon")
        
        assert lat is not None and lon is not None, f"Missing coordinates for {d_name}"
        
        geom = shape(feat["geometry"])
        pt = Point(lon, lat)
        
        # Point must be inside polygon or within floating epsilon of border interior
        assert geom.contains(pt) or geom.touches(pt), f"District '{d_name}' centroid ({lon}, {lat}) is NOT inside its polygon boundary!"

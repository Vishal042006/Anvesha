"""
ANVESHA 2.0 — CANONICAL SPATIAL & GEOGRAPHIC REST API ROUTES
============================================================
Exposes production-grade geographic intelligence endpoints:
1. GET /api/v1/spatial/levels — Dynamic list of supported geographic levels
2. GET /api/v1/spatial/categories — Supported crime taxonomy categories
3. GET /api/v1/spatial/map — Canonical GeoJSON FeatureCollection query endpoint
4. GET /api/v1/spatial/summary — Lightweight summary statistics for spatial filter
5. GET /api/v1/spatial/unit/{geography_id} — Detailed side-panel unit history & forecast
6. Backwards-compatible aliases (/spatial/crime, /spatial/cities, /police-stations)
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, Path
from backend.app.services.spatial_service import spatial_service

router = APIRouter()


@router.get("/spatial/levels")
def get_spatial_levels():
    """Returns dynamic list of supported geographic levels (state, district, police_unit, police_station)."""
    return spatial_service.get_spatial_levels()


@router.get("/spatial/categories")
def get_spatial_categories():
    """Returns available crime taxonomy categories from dataset."""
    return spatial_service.get_spatial_categories()


@router.get("/spatial/map")
def get_spatial_map(
    level: str = Query("police_unit", description="Geographic level: state, district, police_unit, police_station"),
    year: int = Query(2023, ge=2001, le=2030, description="Target data/forecast year"),
    start_year: Optional[int] = Query(None, description="Optional range start year"),
    end_year: Optional[int] = Query(None, description="Optional range end year"),
    crime_category: str = Query("ALL_CRIME", description="Crime category filter"),
    metric: str = Query("crime_count", description="Primary metric: crime_count, crime_rate_per_100k, population, regime, change_point, forecast"),
    state: Optional[str] = Query("TAMIL NADU", description="State or Union Territory filter"),
    district: Optional[str] = Query(None, description="Optional district name filter"),
    police_unit: Optional[str] = Query(None, description="Optional police unit filter"),
    regime: Optional[str] = Query(None, description="Optional regime filter: Stable, High / Increasing"),
    include_crimeshift: bool = Query(True, description="Include CRIME-SHIFT regime and forecast overlays"),
    geography_basis: str = Query("historically_harmonized", description="Geography boundary basis")
):
    """
    Canonical GeoJSON Map Endpoint.
    Returns valid GeoJSON FeatureCollection joined with observed crime panel data,
    CRIME-SHIFT regimes, change points (BOCPD + PELT), and conformal forecasts.
    """
    return spatial_service.get_spatial_map(
        level=level,
        year=year,
        start_year=start_year,
        end_year=end_year,
        crime_category=crime_category,
        metric=metric,
        state=state,
        district=district,
        police_unit=police_unit,
        regime=regime,
        include_crimeshift=include_crimeshift,
        geography_basis=geography_basis
    )


@router.get("/spatial/summary")
def get_spatial_summary(
    state_ut: Optional[str] = Query("TAMIL NADU", description="State or Union Territory filter"),
    year: int = Query(2023, description="Target year"),
    category: str = Query("ALL_CRIME", description="Crime category filter"),
    level: str = Query("police_unit", description="Geographic level")
):
    """Provides lightweight summary statistics for the selected spatial filter."""
    return spatial_service.get_spatial_summary(
        state_ut=state_ut or "TAMIL NADU",
        year=year,
        category=category,
        level=level
    )


@router.get("/spatial/unit/{geography_id}")
def get_spatial_unit_details(
    geography_id: str = Path(..., description="Canonical ID or reporting unit name (e.g. GEO_TN_002 or 'Chennai City')"),
    year_cutoff: int = Query(2023, ge=2001, le=2030, description="Strict historical cutoff year to prevent temporal leakage"),
    category: Optional[str] = Query("ALL_CRIME", description="Crime category filter")
):
    """
    Detailed Unit Side-Panel Endpoint.
    Returns unit metadata, 2001-2023 observed crime history, CRIME-SHIFT regime history,
    change points, multi-horizon forecasts, and provenance tags.
    """
    details = spatial_service.get_unit_details(geography_id=geography_id, year_cutoff=year_cutoff, category=category or "ALL_CRIME")
    if not details or not details.get("geography"):
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "GEOGRAPHY_NOT_FOUND",
                    "message": f"The requested police unit '{geography_id}' was not found."
                }
            }
        )
    return details


@router.get("/spatial/unit-details")
def get_spatial_unit_details_query(
    unit_name: str = Query(..., description="Reporting unit name"),
    year: int = Query(2023, ge=2001, le=2030, description="Target or cutoff year"),
    category: Optional[str] = Query("ALL_CRIME", description="Crime category filter")
):
    details = spatial_service.get_unit_details(geography_id=unit_name, year_cutoff=year, category=category or "ALL_CRIME")
    if not details or not details.get("geography"):
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "GEOGRAPHY_NOT_FOUND", "message": f"Unit '{unit_name}' not found."}}
        )
    details_copy = dict(details)
    details_copy["year"] = year
    details_copy["historical_timeline"] = details_copy.get("crime_history", [])
    return details_copy


# ==============================================================================
# BACKWARDS-COMPATIBLE ALIASES
# ==============================================================================

@router.get("/spatial/crime")
@router.get("/geography")
def get_spatial_crime_legacy(
    state_ut: Optional[str] = Query("TAMIL NADU", description="State or Union Territory filter"),
    category: Optional[str] = Query(None, description="Crime category filter"),
    crime_category: Optional[str] = Query(None, description="Crime category filter alias"),
    year: int = Query(2023, description="Target year"),
    layer: str = Query("observed", description="Map layer mode: observed, forecast, trend, anomaly")
):
    """Backwards-compatible legacy route for spatial crime maps."""
    effective_cat = crime_category or category or "ALL_CRIME"
    return spatial_service.get_spatial_crime(state_ut=state_ut, category=effective_cat, year=year, layer=layer)


@router.get("/spatial/cities")
def get_spatial_cities():
    """Backwards-compatible route for commissionerate city center locations."""
    return spatial_service.get_city_locations()


@router.get("/police-stations")
def get_police_stations():
    """Backwards-compatible route for police station coordinates."""
    return spatial_service.get_police_stations()

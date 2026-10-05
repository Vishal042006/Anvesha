from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/geography/states")
def get_geography_states():
    return analytics_service.get_states()

@router.get("/geography/districts")
def get_geography_districts(state_ut: Optional[str] = Query(None, description="Filter by State or UT")):
    return analytics_service.get_districts(state_ut=state_ut)

@router.get("/geography/cities")
def get_geography_cities(state_ut: Optional[str] = Query(None, description="Filter by State or UT")):
    return analytics_service.get_cities(state_ut=state_ut)

@router.get("/crime/summary")
@router.get("/summary")
@router.get("/analytics/summary")
def get_crime_summary():
    return analytics_service.get_summary()

@router.get("/crime/categories")
def get_crime_categories():
    return analytics_service.get_crime_categories()

@router.get("/crime/history/{unit}")
def get_crime_history(
    unit: str,
    state_ut: Optional[str] = Query(None),
    category: str = Query("ipc_total"),
    admin_level: str = Query("DISTRICT")
):
    return analytics_service.get_district_analytics(unit, state_ut=state_ut, category=category, admin_level=admin_level)

@router.get("/districts/{district}/analytics")
def get_district_analytics(
    district: str,
    state_ut: Optional[str] = Query(None),
    category: str = Query("ipc_total"),
    admin_level: str = Query("DISTRICT")
):
    return analytics_service.get_district_analytics(district, state_ut=state_ut, category=category, admin_level=admin_level)

@router.get("/cities/{city}/analytics")
def get_city_analytics(
    city: str,
    state_ut: Optional[str] = Query(None)
):
    return analytics_service.get_city_analytics(city, state_ut=state_ut)

@router.get("/population/{unit}")
def get_population_info(unit: str):
    return analytics_service.get_population_info(unit)

@router.get("/provenance/{dataset}")
def get_provenance(dataset: str):
    return analytics_service.get_provenance(dataset)

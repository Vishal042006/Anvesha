from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.spatial_service import spatial_service

router = APIRouter()

@router.get("/spatial/crime")
@router.get("/spatial/summary")
@router.get("/geography")
def get_spatial_crime(
    state_ut: Optional[str] = Query("TAMIL NADU", description="State or Union Territory filter"),
    category: str = Query("TOTAL_IPC", description="Crime category filter"),
    year: int = Query(2023, description="Target year"),
    layer: str = Query("observed", description="Map layer mode: observed, forecast, trend, anomaly")
):
    return spatial_service.get_spatial_crime(state_ut=state_ut, category=category, year=year, layer=layer)

@router.get("/spatial/cities")
def get_spatial_cities():
    return spatial_service.get_city_locations()

@router.get("/police-stations")
def get_police_stations():
    return spatial_service.get_police_stations()

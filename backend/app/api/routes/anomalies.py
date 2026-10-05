from typing import Optional
from fastapi import APIRouter, Query, Body
from backend.app.services.anomaly_service import anomaly_service
from backend.app.services.explainability_service import explainability_service

router = APIRouter()

@router.get("/anomalies")
def get_anomalies(
    district: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    crime_category: Optional[str] = Query(None),
    method: str = Query("IsolationForest")
):
    return anomaly_service.get_anomalies(district, year, crime_category, method)

@router.post("/anomalies/investigate")
def investigate_anomaly(
    payload: dict = Body(...)
):
    district = payload.get("district", "Pune")
    state_ut = payload.get("state_ut", "Maharashtra")
    category = payload.get("crime_category", "Property Crime")
    year = int(payload.get("year", 2022))
    obs_val = float(payload.get("observed_volume", 1420.0))
    prev_val = float(payload.get("previous_year_volume", 1080.0))
    
    return explainability_service.investigate_unusual_change(
        district=district,
        state_ut=state_ut,
        crime_category=category,
        year=year,
        observed_val=obs_val,
        prev_val=prev_val
    )

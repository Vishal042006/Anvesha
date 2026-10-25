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
    district = payload.get("district", "Chennai")
    state_ut = payload.get("state_ut", "TAMIL NADU")
    category = payload.get("crime_category", "ALL_CRIME")
    year = int(payload.get("year", 2023))
    obs_val = float(payload["observed_volume"]) if payload.get("observed_volume") is not None else None
    prev_val = float(payload["previous_year_volume"]) if payload.get("previous_year_volume") is not None else None
    
    return explainability_service.investigate_unusual_change(
        district=district,
        state_ut=state_ut,
        crime_category=category,
        year=year,
        observed_val=obs_val,
        prev_val=prev_val
    )

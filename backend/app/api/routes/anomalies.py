from fastapi import APIRouter, Query
from typing import Optional
from backend.app.api.schemas.anomalies import AnomalyResponse
from backend.app.services.anomaly_service import anomaly_service

router = APIRouter()

@router.get("/anomalies", response_model=AnomalyResponse)
def get_anomalies(
    district: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    crime_category: Optional[str] = Query(None),
    method: str = Query("IsolationForest")
):
    return anomaly_service.get_anomalies(district, year, crime_category, method)

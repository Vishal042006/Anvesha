from fastapi import APIRouter, Query
from typing import Optional
from backend.app.api.schemas.trends import TrendResponse
from backend.app.services.trend_service import trend_service

router = APIRouter()

@router.get("/trends", response_model=TrendResponse)
def get_trends(
    district: Optional[str] = Query(None),
    crime_category: Optional[str] = Query(None),
    threshold_pct: float = Query(5.0)
):
    return trend_service.get_trends(district, crime_category, threshold_pct)

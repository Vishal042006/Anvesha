from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/districts/{district}/analytics")
def get_district_analytics(district: str):
    return analytics_service.get_district_analytics(district)

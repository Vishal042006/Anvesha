from fastapi import APIRouter
from backend.app.services.spatial_service import spatial_service

router = APIRouter()

@router.get("/spatial/crime")
def get_spatial_crime():
    return spatial_service.get_spatial_crime()

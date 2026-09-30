from fastapi import APIRouter
from backend.app.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "model_status": "MODELS_LOADED",
        "dataset_version": "v2.0.0-anvesha-master"
    }

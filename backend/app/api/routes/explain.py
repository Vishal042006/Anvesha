from fastapi import APIRouter
from backend.app.services.explainability_service import explainability_service

router = APIRouter()

@router.get("/explain/{prediction_id}")
def get_prediction_explanation(prediction_id: str):
    return explainability_service.explain_prediction(prediction_id)

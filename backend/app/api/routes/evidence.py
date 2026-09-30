from fastapi import APIRouter, Query
from backend.app.api.schemas.evidence import EvidenceSearchResponse
from backend.app.services.evidence_service import evidence_service

router = APIRouter()

@router.get("/evidence/search", response_model=EvidenceSearchResponse)
def search_evidence(q: str = Query("crime statistics Tamil Nadu")):
    return evidence_service.search_evidence(q)

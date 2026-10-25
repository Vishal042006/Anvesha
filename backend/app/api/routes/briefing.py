"""
================================================================================
ANVESHA 2.0 — DISTRICT INTELLIGENCE BRIEFING ROUTE
================================================================================
Exposes GET /api/v1/briefing/district for evidence-grounded multi-source briefings.
"""

from fastapi import APIRouter, Query
from typing import Optional
from backend.app.services.briefing_service import briefing_service

router = APIRouter()

@router.get("/briefing/district")
def get_district_briefing(
    district: str = Query("Chennai", description="District or reporting unit name"),
    category: str = Query("ALL_CRIME", description="Crime category code"),
    year: int = Query(2023, description="Historical cutoff year"),
    state_ut: Optional[str] = Query(None, description="Optional State or UT name")
):
    """
    Returns a unified, evidence-grounded District Intelligence Briefing covering:
    - THE OBSERVED PATTERN (official counts, comparisons, regimes, PELT change points)
    - LOCAL DEVELOPMENTS & REPORTED INCIDENTS (GNews/NewsData, cutoff filtered)
    - WHAT THE RESEARCH SAYS (OpenAlex/Crossref/Semantic Scholar verified studies)
    - WHAT THE EVIDENCE SUGGESTS (3-level synthesis: Observed, Reported, Interpreted)
    - PUBLIC-SAFETY INFORMATION (verified police emergency contacts & advisories)
    - EVIDENCE QUALITY & LIMITATIONS (rule-based evaluation)
    """
    return briefing_service.get_briefing(
        district=district,
        category=category,
        year=year,
        state_ut=state_ut
    )

"""
ANVESHA 2.0 — NEWS SEARCH API ROUTE
===================================
Exposes GET /api/v1/news/search for fetching category & district aware news.
"""

from fastapi import APIRouter, Query
from backend.app.services.news_service import news_service

from typing import Optional

router = APIRouter()

@router.get("/news/search")
def search_news(
    district: str = Query("Chennai", description="District name"),
    category: str = Query("ALL_CRIME", description="Crime category"),
    limit: int = Query(6, ge=1, le=20, description="Max news articles to retrieve"),
    year_cutoff: Optional[int] = Query(None, description="Historical year cutoff")
):
    """
    Search GNews & NewsData.io APIs for news articles matching the selected context and year cutoff.
    """
    limit_int = int(limit.default if hasattr(limit, "default") else limit)
    return news_service.search_news(district=district, category=category, limit=limit_int, year_cutoff=year_cutoff)


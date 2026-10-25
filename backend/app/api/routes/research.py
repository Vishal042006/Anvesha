from fastapi import APIRouter, Query, Body
from typing import Optional, Dict, Any
from backend.research import (
    research_search_service,
    bge_m3_retriever,
    bge_reranker,
    synthesis_service,
    tangible_action_engine
)

router = APIRouter()

@router.get("/research/search")
def search_scholarly_research(query: str = Query("property crime prevention", description="Scholarly research query")):
    """
    Search OpenAlex, Semantic Scholar, and Crossref, normalize and deduplicate records,
    and apply BGE-M3 dense retrieval and BGE reranking.
    """
    # 1. Search OpenAlex + Semantic Scholar + Crossref
    search_res = research_search_service.search_all_sources(query, limit_per_source=15)
    papers = search_res.get("papers", [])

    if not papers:
        return search_res

    # 2. Dense Semantic Retrieval via BGE-M3
    candidate_tuples = bge_m3_retriever.rank_candidates(query, papers, top_k=15)

    # 3. Reranking via BGE Reranker v2 M3
    reranked_tuples = bge_reranker.rerank(query, candidate_tuples, top_k=10)
    top_papers = [t[0] for t in reranked_tuples]

    search_res["total_results"] = len(top_papers)
    search_res["papers"] = top_papers
    return search_res

@router.post("/research/explain")
def explain_area_findings(payload: Dict[str, Any] = Body(...)):
    """
    Synthesizes area-level crime findings, real-time local news, and retrieved research evidence
    into tangible, plain-English, district-specific decision support.
    """
    query = payload.get("query", "crime prevention")
    district = payload.get("district", "Chennai")
    category = payload.get("category", "ALL_CRIME")
    year = int(payload.get("year", 2023))
    state_ut = payload.get("state_ut", "PUDUCHERRY" if district.upper() in ["PUDUCHERRY", "KARAIKAL"] else "TAMIL NADU")
    trend_note = payload.get("trend_note", f"Selected historical year {year}")

    # 1. Fetch top reranked research papers
    search_res = search_scholarly_research(query)
    papers = search_res.get("papers", [])

    # 2. Fetch real-time localized news (always latest to inform current situational awareness)
    from backend.app.services.news_service import news_service
    news_res = news_service.search_news(district=district, category=category, limit=3)
    news_articles = news_res.get("articles", [])

    # 3. Fetch official historical statistics & population
    from backend.app.services.analytics_service import analytics_service
    from backend.app.services.briefing_service import get_district_population_lakhs

    analytics_res = analytics_service.get_district_analytics(district, state_ut, category)
    traj = analytics_res.get("historical_trajectory", [])
    pt = next((p for p in reversed(traj) if p.get("year") <= year), None) if traj else None
    prev_pt = next((p for p in reversed(traj) if p.get("year") < (pt["year"] if pt else year)), None) if traj else None

    count = pt.get("crime_count") if pt else None
    prev_count = prev_pt.get("crime_count") if prev_pt else None
    pop_lakhs = get_district_population_lakhs(district)
    crime_rate_pct = round((count / (pop_lakhs * 100000)) * 100, 3) if count and pop_lakhs else None
    yoy_pct = round(((count - prev_count) / prev_count) * 100, 1) if count and prev_count and prev_count > 0 else None

    crime_context = {
        "district": district,
        "category": category,
        "year": year,
        "observed_volume": int(count) if count is not None else None,
        "population_lakhs": pop_lakhs,
        "crime_rate_pct": crime_rate_pct,
        "yoy_pct": yoy_pct,
        "trend_note": trend_note,
        "news_articles": news_articles
    }

    # 4. Perform dynamic, tangible synthesis
    synthesis_output = synthesis_service.synthesize_explanation(
        query=query,
        crime_context=crime_context,
        papers=papers,
        news_articles=news_articles
    )
    return synthesis_output

@router.post("/research/action-plan")
def generate_action_plan(payload: Dict[str, Any] = Body(...)):
    """
    Tangible Action Engine endpoint: Takes structured crime finding parameters
    and generates concrete, evidence-validated recommendation objects with actionability levels.
    """
    return tangible_action_engine.run_action_pipeline(payload)

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
    Synthesizes area-level crime findings and retrieved research evidence into simple,
    non-technical decision support explanations (What's changing, Why, What can help, Sources).
    """
    query = payload.get("query", "property crime prevention")
    district = payload.get("district", "Tamil Nadu Region")
    category = payload.get("category", "Property Crimes")
    trend_note = payload.get("trend_note", "Observed historical variation")

    # Fetch top reranked research papers
    search_res = search_scholarly_research(query)
    papers = search_res.get("papers", [])

    crime_context = {
        "district": district,
        "category": category,
        "trend_note": trend_note,
    }

    # Perform Qwen3-8B synthesis into simple evidence-grounded explanation
    synthesis_output = synthesis_service.synthesize_explanation(query, crime_context, papers)
    return synthesis_output

@router.post("/research/action-plan")
def generate_action_plan(payload: Dict[str, Any] = Body(...)):
    """
    Tangible Action Engine endpoint: Takes structured crime finding parameters
    and generates concrete, evidence-validated recommendation objects with actionability levels.
    """
    return tangible_action_engine.run_action_pipeline(payload)

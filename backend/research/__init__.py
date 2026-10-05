from backend.research.openalex import openalex_client
from backend.research.semantic_scholar import semantic_scholar_client
from backend.research.crossref import crossref_client
from backend.research.normalize import normalize_paper
from backend.research.deduplicate import deduplicate_papers
from backend.research.search import research_search_service
from backend.research.embeddings import bge_m3_retriever
from backend.research.reranker import bge_reranker
from backend.research.synthesis import synthesis_service
from backend.research.action_engine import tangible_action_engine, ActionableCrimeFinding, EvidenceRecord

__all__ = [
    "openalex_client",
    "semantic_scholar_client",
    "crossref_client",
    "normalize_paper",
    "deduplicate_papers",
    "research_search_service",
    "bge_m3_retriever",
    "bge_reranker",
    "synthesis_service",
    "tangible_action_engine",
    "ActionableCrimeFinding",
    "EvidenceRecord",
]

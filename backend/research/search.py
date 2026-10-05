import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any

from backend.research.openalex import openalex_client
from backend.research.semantic_scholar import semantic_scholar_client
from backend.research.crossref import crossref_client
from backend.research.normalize import normalize_paper
from backend.research.deduplicate import deduplicate_papers

logger = logging.getLogger(__name__)

class ResearchSearchService:
    """Multi-source scholarly research search service."""

    def search_all_sources(self, query: str, limit_per_source: int = 15) -> Dict[str, Any]:
        """
        Queries OpenAlex, Semantic Scholar, and Crossref concurrently,
        normalizes all retrieved records, and deduplicates them into a clean paper set.
        """
        if not query or not query.strip():
            return {
                "query": "",
                "total_results": 0,
                "sources_queried": ["OpenAlex", "Semantic Scholar", "Crossref"],
                "raw_counts": {"OpenAlex": 0, "Semantic Scholar": 0, "Crossref": 0},
                "papers": []
            }

        clean_query = query.strip()
        raw_papers: List[Dict[str, Any]] = []
        raw_counts = {"OpenAlex": 0, "Semantic Scholar": 0, "Crossref": 0}

        def fetch_openalex():
            try:
                res = openalex_client.search(clean_query, limit=limit_per_source)
                return "OpenAlex", res
            except Exception as e:
                logger.error(f"OpenAlex worker failed: {e}")
                return "OpenAlex", []

        def fetch_semantic_scholar():
            try:
                res = semantic_scholar_client.search(clean_query, limit=limit_per_source)
                return "Semantic Scholar", res
            except Exception as e:
                logger.error(f"Semantic Scholar worker failed: {e}")
                return "Semantic Scholar", []

        def fetch_crossref():
            try:
                res = crossref_client.search(clean_query, limit=limit_per_source)
                return "Crossref", res
            except Exception as e:
                logger.error(f"Crossref worker failed: {e}")
                return "Crossref", []

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(fetch_openalex),
                executor.submit(fetch_semantic_scholar),
                executor.submit(fetch_crossref)
            ]
            for future in as_completed(futures):
                source_name, results = future.result()
                raw_counts[source_name] = len(results)
                for item in results:
                    normalized = normalize_paper(item)
                    if normalized["title"]:
                        raw_papers.append(normalized)

        # Deduplicate across sources
        deduplicated = deduplicate_papers(raw_papers)

        return {
            "query": clean_query,
            "total_results": len(deduplicated),
            "sources_queried": ["OpenAlex", "Semantic Scholar", "Crossref"],
            "raw_counts": raw_counts,
            "papers": deduplicated
        }

research_search_service = ResearchSearchService()

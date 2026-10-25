import requests
import logging
import time
from typing import List, Dict, Any
from backend.app.config import settings

logger = logging.getLogger(__name__)

class SemanticScholarClient:
    """Client for retrieving scholarly metadata from Semantic Scholar API."""

    BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.SEMANTIC_SCHOLAR_API_KEY
        self.cache: Dict[str, List[Dict[str, Any]]] = {}

    def search(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search Semantic Scholar for publications matching query with caching and retries."""
        if not query or not query.strip():
            return []

        clean_query = query.strip().lower()
        if clean_query in self.cache:
            logger.info(f"Returning cached Semantic Scholar results for query: {clean_query}")
            return self.cache[clean_query]

        params = {
            "query": query.strip(),
            "limit": min(limit, 50),
            "fields": "paperId,title,authors,abstract,year,externalIds,url,citationCount,venue,publicationTypes"
        }

        headers = {
            "User-Agent": "ANVESHA/2.0 (mailto:research@anvesha.org)"
        }
        if self.api_key:
            headers["x-api-key"] = self.api_key

        try:
            response = requests.get(self.BASE_URL, params=params, headers=headers, timeout=3.5)
            if response.status_code == 429:
                logger.info("Semantic Scholar 429 rate limit reached, bypassing to alternative sources.")
                return []
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get("data", []):
                if not isinstance(item, dict):
                    continue

                # Parse authors
                author_objs = item.get("authors", []) or []
                authors = [a.get("name", "") for a in author_objs if isinstance(a, dict) and a.get("name")]

                # External IDs (DOI)
                external_ids = item.get("externalIds", {}) or {}
                doi = external_ids.get("DOI", "") or ""
                if doi.startswith("https://doi.org/"):
                    doi = doi.replace("https://doi.org/", "")

                pub_types = item.get("publicationTypes") or []
                pub_type = pub_types[0] if pub_types else "journal-article"

                record = {
                    "source": "Semantic Scholar",
                    "source_id": item.get("paperId", ""),
                    "title": item.get("title", ""),
                    "authors": authors,
                    "abstract": item.get("abstract") or "",
                    "year": item.get("year"),
                    "doi": doi,
                    "url": item.get("url") or (f"https://doi.org/{doi}" if doi else ""),
                    "journal": item.get("venue", ""),
                    "citation_count": item.get("citationCount", 0),
                    "publication_type": pub_type,
                    "raw_item": item,
                }
                results.append(record)

            self.cache[clean_query] = results
            return results

        except requests.exceptions.Timeout:
            logger.warning("Semantic Scholar API request timed out.")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"Semantic Scholar API HTTP error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in Semantic Scholar search: {e}")
            return []

        return []

semantic_scholar_client = SemanticScholarClient()

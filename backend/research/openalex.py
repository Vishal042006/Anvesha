import requests
import logging
from typing import List, Dict, Any
from backend.app.config import settings

logger = logging.getLogger(__name__)

class OpenAlexClient:
    """Client for retrieving scholarly work metadata from OpenAlex API."""

    BASE_URL = "https://api.openalex.org/works"

    def __init__(self, api_key: str = None, email: str = None):
        self.api_key = api_key or settings.OPENALEX_API_KEY
        self.email = email or settings.CROSSREF_EMAIL

    def _reconstruct_abstract(self, inverted_index: Dict[str, List[int]]) -> str:
        """Reconstruct abstract text from OpenAlex inverted index format."""
        if not inverted_index or not isinstance(inverted_index, dict):
            return ""
        try:
            position_word_map = {}
            for word, positions in inverted_index.items():
                for pos in positions:
                    position_word_map[pos] = word
            max_pos = max(position_word_map.keys())
            words = [position_word_map.get(i, "") for i in range(max_pos + 1)]
            return " ".join(filter(None, words))
        except Exception as e:
            logger.warning(f"Failed to reconstruct abstract from OpenAlex inverted index: {e}")
            return ""

    def search(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search OpenAlex for scholarly publications matching query."""
        if not query or not query.strip():
            return []

        params = {
            "search": query.strip(),
            "per_page": min(limit, 50),
        }
        if self.api_key:
            params["api_key"] = self.api_key

        headers = {
            "User-Agent": f"ANVESHA/2.0 (mailto:{self.email or 'research@anvesha.org'})"
        }

        try:
            response = requests.get(self.BASE_URL, params=params, headers=headers, timeout=10)
            if response.status_code == 429:
                logger.warning("OpenAlex API rate limit reached.")
                return []
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get("results", []):
                if not isinstance(item, dict):
                    continue

                # Parse authors
                authorships = item.get("authorships", []) or []
                authors = []
                for auth in authorships:
                    author_obj = auth.get("author", {}) or {}
                    name = author_obj.get("display_name")
                    if name:
                        authors.append(name)

                # Reconstruct abstract
                abstract = self._reconstruct_abstract(item.get("abstract_inverted_index"))

                # Parse primary source venue
                primary_loc = item.get("primary_location", {}) or {}
                source_obj = primary_loc.get("source", {}) or {}
                journal = source_obj.get("display_name", "")

                # Clean DOI
                doi = item.get("doi", "") or ""
                if doi.startswith("https://doi.org/"):
                    doi = doi.replace("https://doi.org/", "")

                url = item.get("doi") or primary_loc.get("landing_page_url") or item.get("id", "")

                record = {
                    "source": "OpenAlex",
                    "source_id": item.get("id", ""),
                    "title": item.get("display_name") or item.get("title", ""),
                    "authors": authors,
                    "abstract": abstract,
                    "year": item.get("publication_year"),
                    "doi": doi,
                    "url": url,
                    "journal": journal,
                    "citation_count": item.get("cited_by_count", 0),
                    "publication_type": item.get("type", "article"),
                    "raw_item": item,
                }
                results.append(record)

            return results

        except requests.exceptions.Timeout:
            logger.warning("OpenAlex API request timed out.")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenAlex API HTTP error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in OpenAlex search: {e}")
            return []

openalex_client = OpenAlexClient()

import requests
import logging
from typing import List, Dict, Any
from urllib.parse import quote
from backend.app.config import settings

logger = logging.getLogger(__name__)

class CrossrefClient:
    """Client for retrieving scholarly work metadata from Crossref API."""

    BASE_URL = "https://api.crossref.org/works"

    def __init__(self, email: str = None):
        self.email = email or settings.CROSSREF_EMAIL

    def search(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search Crossref for works matching query using polite API access."""
        if not query or not query.strip():
            return []

        params = {
            "query": query.strip(),
            "rows": min(limit, 50),
        }

        email_contact = self.email or "research@anvesha.org"
        headers = {
            "User-Agent": f"ANVESHA/2.0 (mailto:{email_contact})"
        }

        try:
            response = requests.get(self.BASE_URL, params=params, headers=headers, timeout=10)
            if response.status_code == 429:
                logger.warning("Crossref API rate limit hit.")
                return []
            response.raise_for_status()
            data = response.json()

            items = data.get("message", {}).get("items", [])
            results = []

            for item in items:
                if not isinstance(item, dict):
                    continue

                # Title
                titles = item.get("title", [])
                title = titles[0] if isinstance(titles, list) and titles else ""

                # Authors
                author_objs = item.get("author", []) or []
                authors = []
                for a in author_objs:
                    if isinstance(a, dict):
                        name_parts = [a.get("given", ""), a.get("family", "")]
                        full_name = " ".join(p for p in name_parts if p).strip()
                        if full_name:
                            authors.append(full_name)

                # Publication Year
                year = None
                date_fields = ["published-print", "published-online", "created", "issued"]
                for df in date_fields:
                    dp = item.get(df, {}).get("date-parts", [])
                    if dp and isinstance(dp, list) and dp[0] and isinstance(dp[0], list):
                        year = dp[0][0]
                        break

                # Journal / Venue
                container_titles = item.get("container-title", [])
                journal = container_titles[0] if isinstance(container_titles, list) and container_titles else item.get("publisher", "")

                # DOI
                doi = item.get("DOI", "") or ""

                record = {
                    "source": "Crossref",
                    "source_id": doi,
                    "title": title,
                    "authors": authors,
                    "abstract": item.get("abstract", "") or "",
                    "year": year,
                    "doi": doi,
                    "url": item.get("URL") or (f"https://doi.org/{doi}" if doi else ""),
                    "journal": journal,
                    "citation_count": item.get("is-referenced-by-count", 0),
                    "publication_type": item.get("type", "journal-article"),
                    "raw_item": item,
                }
                results.append(record)

            return results

        except requests.exceptions.Timeout:
            logger.warning("Crossref API request timed out.")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"Crossref API HTTP error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in Crossref search: {e}")
            return []

crossref_client = CrossrefClient()

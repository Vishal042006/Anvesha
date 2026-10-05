import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def _normalize_title_key(title: str) -> str:
    """Helper to convert title into a clean matching key."""
    if not title:
        return ""
    # Remove punctuation, lowercase, collapse spaces
    cleaned = re.sub(r"[^\w\s]", "", title.lower())
    return " ".join(cleaned.split())

def _extract_first_author_surname(authors: List[str]) -> str:
    """Helper to extract first author's last name for matching."""
    if not authors or not authors[0]:
        return ""
    first_author = authors[0].strip().lower()
    parts = first_author.split()
    return parts[-1] if parts else ""

def deduplicate_papers(papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deduplicate a list of normalized paper records across multiple sources
    (OpenAlex, Semantic Scholar, Crossref), merging metadata when duplicates exist.
    """
    if not papers:
        return []

    unique_records: List[Dict[str, Any]] = []

    for paper in papers:
        title = paper.get("title", "")
        if not title:
            continue

        doi = paper.get("doi", "")
        title_key = _normalize_title_key(title)
        first_author = _extract_first_author_surname(paper.get("authors", []))
        year = paper.get("year")

        matched_index = None

        # Check existing unique records for match
        for idx, existing in enumerate(unique_records):
            existing_doi = existing.get("doi", "")
            existing_title_key = _normalize_title_key(existing.get("title", ""))
            existing_first_author = _extract_first_author_surname(existing.get("authors", []))
            existing_year = existing.get("year")

            # 1. Exact DOI match
            if doi and existing_doi and doi == existing_doi:
                matched_index = idx
                break

            # 2. Exact normalized title match
            if title_key and existing_title_key and title_key == existing_title_key:
                matched_index = idx
                break

            # 3. First author surname + year + strong title similarity
            if (
                first_author
                and existing_first_author
                and first_author == existing_first_author
                and year is not None
                and existing_year is not None
                and year == existing_year
                and title_key
                and existing_title_key
                and (title_key in existing_title_key or existing_title_key in title_key)
            ):
                matched_index = idx
                break

        if matched_index is None:
            # New unique paper
            unique_records.append(paper)
        else:
            # Merge paper into existing matched record
            existing = unique_records[matched_index]

            # Merge source databases
            existing_sources = set(existing.get("source_databases", [existing.get("source")]))
            new_source = paper.get("source")
            if new_source:
                existing_sources.add(new_source)
            existing["source_databases"] = sorted(list(existing_sources))

            # Merge abstract (keep longer non-empty abstract)
            new_abstract = paper.get("abstract", "")
            if len(new_abstract) > len(existing.get("abstract", "")):
                existing["abstract"] = new_abstract

            # Merge citation count (keep maximum)
            existing["citation_count"] = max(existing.get("citation_count", 0), paper.get("citation_count", 0))

            # Merge fields if existing is missing
            if not existing.get("doi") and doi:
                existing["doi"] = doi
            if not existing.get("url") and paper.get("url"):
                existing["url"] = paper.get("url")
            if not existing.get("journal") and paper.get("journal"):
                existing["journal"] = paper.get("journal")
            if existing.get("year") is None and year is not None:
                existing["year"] = year
            if not existing.get("authors") and paper.get("authors"):
                existing["authors"] = paper.get("authors")

    return unique_records

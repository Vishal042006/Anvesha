import re
from datetime import datetime, timezone
from typing import Dict, Any, List

def clean_doi(doi: str) -> str:
    """Normalize DOI to lowercase canonical format (without URL prefix)."""
    if not doi:
        return ""
    doi_str = str(doi).strip().lower()
    doi_str = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi_str)
    return doi_str.strip()

def normalize_paper(raw_record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize a paper record from OpenAlex, Semantic Scholar, or Crossref
    into the canonical ANVESHA research paper schema.
    """
    source = str(raw_record.get("source", "Unknown"))
    source_id = str(raw_record.get("source_id", ""))
    
    title = str(raw_record.get("title") or "").strip()
    
    # Parse authors
    raw_authors = raw_record.get("authors", [])
    authors: List[str] = []
    if isinstance(raw_authors, list):
        for a in raw_authors:
            if isinstance(a, str) and a.strip():
                authors.append(a.strip())
            elif isinstance(a, dict) and a.get("name"):
                authors.append(str(a["name"]).strip())
    
    # Abstract
    abstract = str(raw_record.get("abstract") or "").strip()
    
    # Year
    year = raw_record.get("year")
    try:
        year = int(year) if year is not None and str(year).isdigit() else None
    except Exception:
        year = None
        
    # DOI
    doi = clean_doi(raw_record.get("doi", ""))
    
    # URL
    url = str(raw_record.get("url") or "").strip()
    if not url and doi:
        url = f"https://doi.org/{doi}"
        
    journal = str(raw_record.get("journal") or "").strip()
    
    # Citation Count
    citation_count = raw_record.get("citation_count", 0)
    try:
        citation_count = int(citation_count) if citation_count is not None else 0
    except Exception:
        citation_count = 0
        
    publication_type = str(raw_record.get("publication_type") or "article").strip()
    retrieved_at = datetime.now(timezone.utc).isoformat()
    
    return {
        "title": title,
        "authors": authors,
        "abstract": abstract,
        "year": year,
        "doi": doi,
        "url": url,
        "journal": journal,
        "citation_count": citation_count,
        "source": source,
        "source_id": source_id,
        "source_databases": [source],
        "publication_type": publication_type,
        "retrieved_at": retrieved_at,
    }

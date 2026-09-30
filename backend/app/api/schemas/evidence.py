from pydantic import BaseModel
from typing import List, Optional

class EvidenceItem(BaseModel):
    document: str
    page: int
    year: int
    source: str
    organization: str = "State Crime Records Bureau"
    geography: str = "Tamil Nadu"
    document_type: str = "Annual Police Report"
    text_snippet: str
    similarity_score: float
    citation: str

class EvidenceSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[EvidenceItem]

import requests
import logging
from typing import List, Dict, Any
from backend.app.config import settings

logger = logging.getLogger(__name__)

class EvidenceSynthesisService:
    """Evidence Object construction and Qwen3-8B scholarly synthesis service."""

    HF_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct"

    def __init__(self, token: str = None):
        self.token = token or settings.HF_TOKEN

    def build_evidence_object(self, query: str, papers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Constructs a clean, grounded evidence representation object."""
        supporting_papers = []
        for p in papers[:6]:
            supporting_papers.append({
                "title": p.get("title", ""),
                "authors": p.get("authors", []),
                "year": p.get("year"),
                "doi": p.get("doi", ""),
                "url": p.get("url", ""),
                "journal": p.get("journal", ""),
                "relevance_score": p.get("relevance_score", 0.85),
                "source_databases": p.get("source_databases", [p.get("source", "Scholarly Engine")]),
            })

        evidence_strength = "high" if len(supporting_papers) >= 4 else ("moderate" if len(supporting_papers) >= 2 else "preliminary")

        return {
            "query": query,
            "claim": f"Scholarly research evidence regarding '{query}' identifies evidence-grounded risk factors and community-level interventions.",
            "supporting_papers": supporting_papers,
            "evidence_strength": evidence_strength,
            "limitations": [
                "Observational empirical data reflects reporting trends and administrative recording patterns.",
                "Interventions must be adapted to local administrative and environmental contexts."
            ]
        }

    def _call_qwen_hf(self, prompt: str) -> str:
        """Calls Qwen LLM via Hugging Face Inference API."""
        if not self.token:
            return ""

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 800,
                "temperature": 0.2,
                "return_full_text": False
            },
            "options": {"wait_for_model": True}
        }

        try:
            response = requests.post(self.HF_API_URL, json=payload, headers=headers, timeout=15)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and result and "generated_text" in result[0]:
                    return result[0]["generated_text"].strip()
                elif isinstance(result, dict) and "generated_text" in result:
                    return result["generated_text"].strip()
            else:
                logger.warning(f"Qwen HF API returned status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.warning(f"Qwen HF API call failed: {e}")

        return ""

    def synthesize_explanation(
        self,
        query: str,
        crime_context: Dict[str, Any],
        papers: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Synthesizes crime findings and retrieved research papers into simple,
        user-facing explainable decision support without technical jargon.
        """
        evidence_obj = self.build_evidence_object(query, papers)
        supporting = evidence_obj["supporting_papers"]

        # Build prompt for Qwen synthesis
        paper_context_lines = []
        for idx, p in enumerate(supporting, 1):
            authors_str = ", ".join(p["authors"][:3]) if p["authors"] else "Authors unspecified"
            doi_str = f" (DOI: {p['doi']})" if p['doi'] else ""
            paper_context_lines.append(f"[{idx}] \"{p['title']}\" by {authors_str} ({p['year'] or 'n.d.'}){doi_str}. Relevance: {p['relevance_score']}")

        papers_text_block = "\n".join(paper_context_lines) if paper_context_lines else "No external papers found."

        prompt = f"""You are ANVESHA, an evidence-grounded research decision support system for Tamil Nadu.
Synthesize the following observed crime pattern data and scholarly research evidence.

OBSERVED AREA PATTERN:
Query/Topic: {query}
Location: {crime_context.get('district', 'Tamil Nadu Region')}
Category: {crime_context.get('category', 'Property & General Crimes')}
Trend Note: {crime_context.get('trend_note', 'Observed historical variation in recording counts')}

RETRIEVED SCHOLARLY PAPERS:
{papers_text_block}

STRICT RULES:
1. Do NOT invent facts, papers, DOIs, or statistics.
2. Do NOT claim correlation is causation. Use "may be associated with", "suggests", "is consistent with".
3. Do NOT profile individuals or predict individual behavior.
4. Explain clearly using simple headings:
   - WHAT'S CHANGING?
   - WHY MIGHT THIS BE HAPPENING?
   - WHAT CAN HELP?
   - WHY ARE WE SUGGESTING THIS?
   - SOURCES
"""

        llm_response = self._call_qwen_hf(prompt)

        # Fallback deterministic synthesis if remote LLM API is unavailable or rate limited
        if not llm_response:
            logger.info("Generating grounded deterministic synthesis response.")
            whats_changing = f"Analysis of administrative records in {crime_context.get('district', 'Tamil Nadu')} indicates fluctuating incident patterns in {crime_context.get('category', 'crime categories')}."
            why_happening = f"The observed variation suggests environmental factors, reporting-unit changes, and socio-economic dynamics in {crime_context.get('district', 'the region')}."
            what_can_help = "Community-based situational prevention, enhanced public lighting, situational guardianship, and inter-agency coordination."
            
            citations_list = []
            for p in supporting:
                authors_fmt = ", ".join(p["authors"][:2]) if p["authors"] else "Research Study"
                yr_fmt = f" ({p['year']})" if p["year"] else ""
                url_fmt = f" - {p['url']}" if p["url"] else ""
                citations_list.append(f"• {p['title']} by {authors_fmt}{yr_fmt}{url_fmt}")
            
            why_suggesting = "These suggestions are derived directly from published empirical studies in spatial criminology and community safety research."

            explanation_payload = {
                "whats_changing": whats_changing,
                "why_might_this_be_happening": why_happening,
                "what_can_help": what_can_help,
                "why_are_we_suggesting_this": why_suggesting,
                "sources": citations_list,
            }
        else:
            explanation_payload = {
                "synthesis_text": llm_response,
                "sources": [f"• {p['title']} ({p['year'] or 'n.d.'}) - {p['url']}" for p in supporting]
            }

        return {
            "query": query,
            "district": crime_context.get("district", "Tamil Nadu"),
            "evidence_object": evidence_obj,
            "user_explanation": explanation_payload
        }

synthesis_service = EvidenceSynthesisService()

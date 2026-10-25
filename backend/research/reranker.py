import requests
import logging
import re
from typing import List, Dict, Any, Tuple
from backend.app.config import settings

logger = logging.getLogger(__name__)

class BGEReranker:
    """Reranker using BAAI/bge-reranker-v2-m3 via Hugging Face API or multi-tier domain scoring."""

    HF_API_URL = "https://api-inference.huggingface.co/models/BAAI/bge-reranker-v2-m3"

    def __init__(self, token: str = None):
        self.token = token or settings.HF_TOKEN

    def _call_hf_reranker(self, query: str, texts: List[str]) -> List[float]:
        """Call Hugging Face BGE Reranker API endpoint with short timeout."""
        if not self.token:
            return []

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": [{"text": query, "text_pair": text} for text in texts],
            "options": {"wait_for_model": True}
        }

        try:
            response = requests.post(self.HF_API_URL, json=payload, headers=headers, timeout=2.0)
            if response.status_code == 200:
                scores_data = response.json()
                scores = []
                if isinstance(scores_data, list):
                    for item in scores_data:
                        if isinstance(item, dict) and "score" in item:
                            scores.append(float(item["score"]))
                        elif isinstance(item, (int, float)):
                            scores.append(float(item))
                        elif isinstance(item, list) and item and isinstance(item[0], dict) and "score" in item[0]:
                            scores.append(float(item[0]["score"]))
                    if len(scores) == len(texts):
                        return scores
        except Exception as e:
            logger.info(f"BGE Reranker HF API not reachable ({e}); using multi-tier domain reranker.")

        return []

    def _score_domain_relevance(self, query: str, paper: Dict[str, Any]) -> Tuple[float, str, str, str, str]:
        """
        Multi-tier domain relevance scoring following ANVESHA scientific specifications:
        1. Geographic hierarchy: Local (district) -> Regional (Tamil Nadu) -> National (India) -> Urban -> Methodological
        2. Category match (theft, burglary, property, violent, etc.)
        3. Methodological relevance (forecasting, time series, change point, regimes)
        4. Recency & publication quality
        """
        title = (paper.get("title") or "").lower()
        abstract = (paper.get("abstract") or "").lower()
        text = f"{title} {abstract}"
        q_lower = query.lower()
        q_words = [w for w in re.findall(r"\w+", q_lower) if len(w) > 3]

        score = 0.50

        # Extract context clues from query
        districts_tn = ["chennai", "coimbatore", "madurai", "salem", "tiruchirappalli", "tirunelveli", "kanchipuram", "vellore", "erode"]
        target_district = next((d for d in districts_tn if d in q_lower), "chennai")

        # Criminological domain verification & noise suppression
        criminology_terms = ["crime", "police", "policing", "criminology", "theft", "burglary", "robbery", "homicide", "murder", "assault", "violence", "offender", "law enforcement", "patrol", "victim", "justice", "penal"]
        is_crime_related = any(kw in text for kw in criminology_terms)
        noise_keywords = ["genome", "genetic", "dna", "molecular", "oncology", "clinical trial", "pediatric", "radiology", "biomedical", "cardiovascular"]
        has_noise = any(nk in text for nk in noise_keywords) and not any(ck in text for ck in ["forensic", "crime scene", "criminology"])

        if has_noise:
            score -= 0.40
        if not is_crime_related:
            score -= 0.25

        # 1. Geographic Scope Hierarchy (granted if crime-related)
        if target_district in text and is_crime_related:
            scope = "LOCAL EVIDENCE"
            geo_score = 0.35
            geo_note = f"Directly investigates crime in {target_district.title()}."
        elif "tamil nadu" in text and is_crime_related:
            scope = "REGIONAL EVIDENCE"
            geo_score = 0.25
            geo_note = "Provides regional empirical evidence for Tamil Nadu."
        elif any(w in text for w in ["india", "indian", "ncrb"]) and is_crime_related:
            scope = "NATIONAL EVIDENCE"
            geo_score = 0.15
            geo_note = "Analyzes national Indian crime datasets and police administration."
        elif any(w in text for w in ["urban", "metropolitan", "city", "precinct"]) and is_crime_related:
            scope = "COMPARABLE URBAN EVIDENCE"
            geo_score = 0.10
            geo_note = "Evaluates comparable metropolitan and urban policing environments."
        else:
            scope = "METHODOLOGICAL EVIDENCE"
            geo_score = 0.05
            geo_note = "Presents general criminological methods and statistical modeling."

        score += geo_score

        # 2. Crime Category Relevance
        crime_keywords = ["theft", "burglary", "robbery", "property", "violent", "homicide", "cyber", "economic", "assault"]
        q_crime_keywords = [w for w in q_words if w in crime_keywords]
        if q_crime_keywords:
            cat_in_title = any(kw in title for kw in q_crime_keywords)
            cat_in_abs = any(kw in abstract for kw in q_crime_keywords)
            if cat_in_title:
                score += 0.25
            elif cat_in_abs:
                score += 0.15

        # 3. Methodological Relevance
        method_keywords = ["forecast", "time series", "trend", "change point", "structural break", "regime", "spatio-temporal", "machine learning"]
        if any(mw in text for mw in method_keywords):
            score += 0.12

        # 4. Recency & Quality
        year = paper.get("year")
        if isinstance(year, (int, float)):
            if year >= 2020:
                score += 0.08
            elif year >= 2015:
                score += 0.04

        if paper.get("doi"):
            score += 0.03
        if paper.get("citation_count", 0) > 10:
            score += 0.03

        # Research question & key finding extraction
        clean_title = paper.get("title", "Study on Crime Distribution")
        res_question = f"How do {', '.join(q_crime_keywords) if q_crime_keywords else 'crime'} patterns evolve in urban jurisdictions?"
        if abstract:
            # First clean sentence of abstract
            first_sent = abstract.split(".")[0].strip().capitalize()
            key_finding = first_sent + "." if not first_sent.endswith(".") else first_sent
        else:
            key_finding = f"Examines empirical patterns and administrative determinants of {clean_title}."

        final_score = round(min(0.99, max(0.40, score)), 4)
        return final_score, scope, geo_note, res_question, key_finding

    def rerank(self, query: str, candidate_tuples: List[Tuple[Dict[str, Any], float]], top_k: int = 10) -> List[Tuple[Dict[str, Any], float]]:
        """
        Reranks candidate paper tuples (paper, initial_score) using BGE Reranker v2 M3 or domain scoring.
        Attaches evidence_scope, relevance_explanation, key_finding, and research_question.
        """
        if not query or not candidate_tuples:
            return []

        papers = [t[0] for t in candidate_tuples]
        paper_texts = [f"Title: {p.get('title', '')}. Abstract: {p.get('abstract', '')[:400]}" for p in papers]

        hf_scores = self._call_hf_reranker(query, paper_texts)

        reranked: List[Tuple[Dict[str, Any], float]] = []

        if hf_scores and len(hf_scores) == len(papers):
            for paper, raw_score in zip(papers, hf_scores):
                norm_score = round(1.0 / (1.0 + 2.71828 ** (-raw_score)), 4) if isinstance(raw_score, float) else 0.85
                _, scope, geo_note, rq, kf = self._score_domain_relevance(query, paper)
                paper["relevance_score"] = norm_score
                paper["evidence_scope"] = scope
                paper["relevance_explanation"] = geo_note
                paper["research_question"] = rq
                paper["key_finding"] = kf
                reranked.append((paper, norm_score))
        else:
            for paper, _ in candidate_tuples:
                d_score, scope, geo_note, rq, kf = self._score_domain_relevance(query, paper)
                paper["relevance_score"] = d_score
                paper["evidence_scope"] = scope
                paper["relevance_explanation"] = geo_note
                paper["research_question"] = rq
                paper["key_finding"] = kf
                reranked.append((paper, d_score))

        # Sort descending by relevance score
        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked[:top_k]

bge_reranker = BGEReranker()

import requests
import logging
import math
import re
from typing import List, Dict, Any, Tuple
from backend.app.config import settings

logger = logging.getLogger(__name__)

class BGEM3Retriever:
    """Dense semantic retrieval using BAAI/bge-m3 via Hugging Face or robust fallback."""

    HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-m3"

    def __init__(self, token: str = None):
        self.token = token or settings.HF_TOKEN

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Compute cosine similarity between two vector lists."""
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def _token_overlap_similarity(self, text_a: str, text_b: str) -> float:
        """Fallback lightweight text similarity when HF API is unavailable."""
        words_a = set(re.findall(r"\w+", text_a.lower()))
        words_b = set(re.findall(r"\w+", text_b.lower()))
        if not words_a or not words_b:
            return 0.0
        intersection = words_a.intersection(words_b)
        union = words_a.union(words_b)
        jaccard = len(intersection) / len(union) if union else 0.0
        return round(0.5 + 0.45 * jaccard, 4)

    def _get_hf_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Call Hugging Face Feature Extraction API for BAAI/bge-m3."""
        if getattr(self, "_hf_disabled", False) or not self.token:
            return []

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {"inputs": texts, "options": {"wait_for_model": True}}

        try:
            response = requests.post(self.HF_API_URL, json=payload, headers=headers, timeout=1.5)
            if response.status_code == 200:
                embeddings = response.json()
                # Handle nested array format [seq_len, dim] or pooled [dim]
                if isinstance(embeddings, list) and len(embeddings) == len(texts):
                    cleaned_vecs = []
                    for vec in embeddings:
                        if isinstance(vec, list) and vec and isinstance(vec[0], list):
                            # Mean pool sequence tokens
                            dim = len(vec[0])
                            avg_vec = [sum(tok[i] for tok in vec) / len(vec) for i in range(dim)]
                            cleaned_vecs.append(avg_vec)
                        elif isinstance(vec, list) and vec and isinstance(vec[0], (int, float)):
                            cleaned_vecs.append(vec)
                        else:
                            cleaned_vecs.append([])
                    return cleaned_vecs
            else:
                logger.warning(f"HF BGE-M3 API returned status {response.status_code}: {response.text[:200]}")
                return []
        except Exception as e:
            self._hf_disabled = True
            logger.info(f"Remote HF API bypassed: {e}")
            return []

        return []

    def rank_candidates(self, query: str, papers: List[Dict[str, Any]], top_k: int = 15) -> List[Tuple[Dict[str, Any], float]]:
        """
        Calculates semantic relevance score for candidate papers using BAAI/bge-m3.
        Returns list of tuples: (paper, similarity_score).
        """
        if not query or not papers:
            return []

        # Prepare paper text representation
        paper_texts = []
        for p in papers:
            t = p.get("title", "")
            a = p.get("abstract", "")
            paper_texts.append(f"Title: {t}. Abstract: {a[:500]}")

        # Attempt HF BGE-M3 API call
        all_texts = [f"Represent this query for retrieving relevant crime research: {query}"] + paper_texts
        hf_vecs = self._get_hf_embeddings(all_texts)

        results: List[Tuple[Dict[str, Any], float]] = []

        if hf_vecs and len(hf_vecs) == len(all_texts) and hf_vecs[0]:
            query_vec = hf_vecs[0]
            for idx, paper in enumerate(papers):
                p_vec = hf_vecs[idx + 1]
                score = round(float(self._cosine_similarity(query_vec, p_vec)), 4) if p_vec else 0.5
                results.append((paper, max(0.01, min(1.0, score))))
        else:
            # Fallback text matching
            logger.info("Using token-overlap fallback scoring for BGE-M3 retrieval.")
            for paper, p_text in zip(papers, paper_texts):
                score = self._token_overlap_similarity(query, p_text)
                results.append((paper, score))

        # Sort descending by score
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

bge_m3_retriever = BGEM3Retriever()

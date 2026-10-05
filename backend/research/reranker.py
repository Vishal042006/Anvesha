import requests
import logging
from typing import List, Dict, Any, Tuple
from backend.app.config import settings

logger = logging.getLogger(__name__)

class BGEReranker:
    """Reranker using BAAI/bge-reranker-v2-m3 via Hugging Face API or fallback."""

    HF_API_URL = "https://api-inference.huggingface.co/models/BAAI/bge-reranker-v2-m3"

    def __init__(self, token: str = None):
        self.token = token or settings.HF_TOKEN

    def _call_hf_reranker(self, query: str, texts: List[str]) -> List[float]:
        """Call Hugging Face BGE Reranker API endpoint."""
        if not self.token:
            return []

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        # Standard cross-encoder format for HF Inference API
        payload = {
            "inputs": [{"text": query, "text_pair": text} for text in texts],
            "options": {"wait_for_model": True}
        }

        try:
            response = requests.post(self.HF_API_URL, json=payload, headers=headers, timeout=12)
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
            else:
                logger.warning(f"HF BGE Reranker returned status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.warning(f"BGE Reranker HF API call failed: {e}")

        return []

    def rerank(self, query: str, candidate_tuples: List[Tuple[Dict[str, Any], float]], top_k: int = 10) -> List[Tuple[Dict[str, Any], float]]:
        """
        Reranks candidate paper tuples (paper, initial_score) using BGE Reranker v2 M3.
        Returns top reranked tuples (paper, reranked_relevance_score).
        """
        if not query or not candidate_tuples:
            return []

        papers = [t[0] for t in candidate_tuples]
        paper_texts = [f"Title: {p.get('title', '')}. Abstract: {p.get('abstract', '')[:400]}" for p in papers]

        hf_scores = self._call_hf_reranker(query, paper_texts)

        reranked: List[Tuple[Dict[str, Any], float]] = []

        if hf_scores and len(hf_scores) == len(papers):
            logger.info("Successfully reranked candidates using remote BGE Reranker v2 M3.")
            for paper, raw_score in zip(papers, hf_scores):
                # Sigmoid / normalize score to [0, 1] range
                norm_score = round(1.0 / (1.0 + 2.71828 ** (-raw_score)), 4) if isinstance(raw_score, float) else 0.85
                paper["relevance_score"] = norm_score
                reranked.append((paper, norm_score))
        else:
            logger.info("Using initial retrieval scores as fallback for reranker.")
            for paper, init_score in candidate_tuples:
                paper["relevance_score"] = init_score
                reranked.append((paper, init_score))

        # Sort descending by relevance score
        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked[:top_k]

bge_reranker = BGEReranker()

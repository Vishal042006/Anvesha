import json
from backend.research import (
    openalex_client,
    semantic_scholar_client,
    crossref_client,
    research_search_service,
    bge_m3_retriever,
    bge_reranker,
    synthesis_service
)

def run_end_to_end_test():
    query = "property crime prevention"
    print(f"=== ANVESHA RESEARCH RETRIEVAL END-TO-END TEST ===")
    print(f"Query: '{query}'\n")

    # 1. Individual Source Search
    oa_res = openalex_client.search(query, limit=15)
    ss_res = semantic_scholar_client.search(query, limit=15)
    cr_res = crossref_client.search(query, limit=15)

    print(f"1. OpenAlex raw results: {len(oa_res)}")
    print(f"2. Semantic Scholar raw results: {len(ss_res)}")
    print(f"3. Crossref raw results: {len(cr_res)}")

    # 2. Unified Search & Normalization & Deduplication
    unified_res = research_search_service.search_all_sources(query, limit_per_source=15)
    deduped_papers = unified_res["papers"]
    print(f"4. Total papers after normalization & deduplication: {len(deduped_papers)}")

    # 3. Dense Semantic Retrieval via BGE-M3
    candidate_tuples = bge_m3_retriever.rank_candidates(query, deduped_papers, top_k=15)
    print(f"5. Papers sent to BGE-M3 dense retriever: {len(candidate_tuples)}")

    # 4. Reranking via BGE Reranker v2 M3
    reranked_tuples = bge_reranker.rerank(query, candidate_tuples, top_k=10)
    top_papers = [t[0] for t in reranked_tuples]

    print("\n=== TOP RERANKED PAPERS ===")
    for idx, (p, score) in enumerate(reranked_tuples[:5], 1):
        authors_fmt = ", ".join(p.get("authors", [])[:3]) if p.get("authors") else "Unknown Authors"
        print(f"[{idx}] Title: {p.get('title')}")
        print(f"    Authors: {authors_fmt}")
        print(f"    Year: {p.get('year')}")
        print(f"    DOI/URL: {p.get('url') or p.get('doi')}")
        print(f"    Source Databases: {p.get('source_databases')}")
        print(f"    Relevance Score: {score}")
        print()

    # 5. Qwen Synthesis
    crime_context = {
        "district": "Coimbatore",
        "category": "Property Crimes",
        "trend_note": "Observed variation in residential burglary rates",
    }
    synthesis = synthesis_service.synthesize_explanation(query, crime_context, top_papers)

    print("=== FINAL QWEN SYNTHESIS ===")
    print(json.dumps(synthesis["user_explanation"], indent=2))

if __name__ == "__main__":
    run_end_to_end_test()

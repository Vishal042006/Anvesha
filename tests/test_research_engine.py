import pytest
from backend.research.openalex import openalex_client
from backend.research.semantic_scholar import semantic_scholar_client
from backend.research.crossref import crossref_client
from backend.research.normalize import normalize_paper, clean_doi
from backend.research.deduplicate import deduplicate_papers
from backend.research.search import research_search_service
from backend.research.embeddings import bge_m3_retriever
from backend.research.reranker import bge_reranker
from backend.research.synthesis import synthesis_service


def test_clean_doi():
    assert clean_doi("https://doi.org/10.1016/j.jcrim.2021.01.002") == "10.1016/j.jcrim.2021.01.002"
    assert clean_doi("10.1016/j.jcrim.2021.01.002") == "10.1016/j.jcrim.2021.01.002"
    assert clean_doi("") == ""


def test_openalex_connectivity():
    res = openalex_client.search("property crime prevention", limit=3)
    assert isinstance(res, list)
    if res:
        first = res[0]
        assert "title" in first
        assert "source" in first
        assert first["source"] == "OpenAlex"


def test_semantic_scholar_connectivity():
    res = semantic_scholar_client.search("crime prevention", limit=3)
    assert isinstance(res, list)
    if res:
        first = res[0]
        assert "title" in first
        assert first["source"] == "Semantic Scholar"


def test_crossref_connectivity():
    res = crossref_client.search("crime analysis", limit=3)
    assert isinstance(res, list)
    if res:
        first = res[0]
        assert "title" in first
        assert first["source"] == "Crossref"


def test_empty_search():
    assert openalex_client.search("") == []
    assert semantic_scholar_client.search("   ") == []
    assert crossref_client.search("") == []

    res = research_search_service.search_all_sources("")
    assert res["total_results"] == 0
    assert res["papers"] == []


def test_invalid_query():
    res = research_search_service.search_all_sources("!!!???nonexistentquery12345xyz???!!!")
    assert isinstance(res, dict)
    assert "papers" in res


def test_missing_doi_abstract_authors_normalization():
    raw = {
        "source": "OpenAlex",
        "title": "Sample Paper Title",
        "authors": [],
        "abstract": None,
        "doi": None,
        "year": "2022",
    }
    normalized = normalize_paper(raw)
    assert normalized["title"] == "Sample Paper Title"
    assert normalized["authors"] == []
    assert normalized["abstract"] == ""
    assert normalized["doi"] == ""
    assert normalized["year"] == 2022


def test_duplicate_papers_deduplication():
    papers = [
        {
            "title": "Crime Prevention Through Environmental Design",
            "authors": ["John Smith", "Alice Paul"],
            "abstract": "Short abstract",
            "year": 2020,
            "doi": "10.1000/182",
            "source": "OpenAlex",
            "citation_count": 10,
        },
        {
            "title": "Crime Prevention Through Environmental Design",
            "authors": ["John Smith"],
            "abstract": "Detailed and longer abstract describing environmental design principles.",
            "year": 2020,
            "doi": "10.1000/182",
            "source": "Semantic Scholar",
            "citation_count": 25,
        },
        {
            "title": "Completely Different Paper on Cyber Security",
            "authors": ["Bob Vance"],
            "abstract": "Cyber security study.",
            "year": 2021,
            "doi": "10.1000/999",
            "source": "Crossref",
            "citation_count": 5,
        },
    ]

    deduped = deduplicate_papers(papers)
    assert len(deduped) == 2
    merged = [p for p in deduped if p["doi"] == "10.1000/182"][0]
    assert "OpenAlex" in merged["source_databases"]
    assert "Semantic Scholar" in merged["source_databases"]
    assert merged["citation_count"] == 25
    assert "Detailed and longer abstract" in merged["abstract"]


def test_bge_m3_retriever_ranking():
    papers = [
        {"title": "Burglary and Theft Prevention Strategies", "abstract": "Study on home security locks and lighting."},
        {"title": "Astrophysics of White Dwarf Stars", "abstract": "Observations of stellar degeneration."},
    ]
    ranked = bge_m3_retriever.rank_candidates("property crime burglary prevention", papers)
    assert len(ranked) == 2
    assert "Burglary" in ranked[0][0]["title"]
    assert ranked[0][1] >= ranked[1][1]


def test_bge_reranker():
    candidate_tuples = [
        ({"title": "Burglary Prevention", "abstract": "Target hardening", "doi": "10.1/1"}, 0.75),
        ({"title": "Unrelated Topic", "abstract": "Other content", "doi": "10.1/2"}, 0.40),
    ]
    reranked = bge_reranker.rerank("property crime prevention", candidate_tuples)
    assert len(reranked) == 2
    assert reranked[0][1] >= reranked[1][1]
    assert "relevance_score" in reranked[0][0]


def test_synthesis_service_evidence_grounding():
    papers = [
        {
            "title": "Situational Crime Prevention in Urban Neighborhoods",
            "authors": ["R. Clarke"],
            "year": 2019,
            "doi": "10.1016/j.jcrim.2019.04.001",
            "url": "https://doi.org/10.1016/j.jcrim.2019.04.001",
            "journal": "Journal of Criminology",
            "relevance_score": 0.94,
            "source_databases": ["OpenAlex", "Crossref"],
        }
    ]
    crime_context = {
        "district": "Coimbatore",
        "category": "Property Crimes",
        "trend_note": "Observed reduction in vehicle theft",
    }
    synthesis = synthesis_service.synthesize_explanation("property crime prevention", crime_context, papers)

    assert "evidence_object" in synthesis
    evidence_obj = synthesis["evidence_object"]
    assert len(evidence_obj["supporting_papers"]) == 1
    assert evidence_obj["supporting_papers"][0]["doi"] == "10.1016/j.jcrim.2019.04.001"

    explanation = synthesis["user_explanation"]
    assert isinstance(explanation, dict)
    assert "sources" in explanation

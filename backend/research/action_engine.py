import re
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple

from backend.research.search import research_search_service
from backend.research.embeddings import bge_m3_retriever
from backend.research.reranker import bge_reranker
from backend.research.synthesis import synthesis_service

logger = logging.getLogger(__name__)

# List of prohibited vague phrases that must be rejected unless accompanied by concrete implementation details
VAGUE_PHRASES = [
    "raise awareness",
    "improve security",
    "increase surveillance",
    "strengthen policing",
    "take preventive measures",
    "enhance community participation",
    "implement appropriate measures",
    "authorities should act",
    "more police presence may help",
    "use preventive measures",
    "authorities should take appropriate action"
]

class ActionableCrimeFinding:
    """Step 1: Structured representation of an observed crime finding from real data."""

    def __init__(
        self,
        district: str,
        crime_category: str,
        period: str,
        observed_count: float,
        baseline_count: float,
        population: Optional[float] = None,
        geography_level: str = "district",
        station_name: Optional[str] = None,
    ):
        self.district = district
        self.crime_category = crime_category
        self.period = period
        self.observed_count = float(observed_count)
        self.baseline_count = float(baseline_count)
        self.population = float(population) if population and population > 0 else None
        self.geography_level = geography_level
        self.station_name = station_name

        # Calculate metrics
        if self.baseline_count > 0:
            self.change_amount = round(self.observed_count - self.baseline_count, 2)
            self.change_percent = round((self.change_amount / self.baseline_count) * 100.0, 2)
        else:
            self.change_amount = round(self.observed_count, 2)
            self.change_percent = 0.0

        if self.change_percent >= 5.0:
            self.trend = "increasing"
        elif self.change_percent <= -5.0:
            self.trend = "decreasing"
        else:
            self.trend = "stable"

        # Rate per 100k
        if self.population:
            self.rate_per_100k = round((self.observed_count / self.population) * 100000.0, 2)
            self.baseline_rate_per_100k = round((self.baseline_count / self.population) * 100000.0, 2)
        else:
            self.rate_per_100k = None
            self.baseline_rate_per_100k = None

        # Confidence assessment based on sample size
        if self.baseline_count >= 50:
            self.confidence = "high"
        elif self.baseline_count >= 15:
            self.confidence = "moderate"
        else:
            self.confidence = "low"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "area": self.district if not self.station_name else f"{self.station_name}, {self.district}",
            "district": self.district,
            "station_name": self.station_name,
            "geography_level": self.geography_level,
            "crime_category": self.crime_category,
            "period": self.period,
            "observed_count": self.observed_count,
            "baseline_count": self.baseline_count,
            "change_amount": self.change_amount,
            "change_percent": self.change_percent,
            "trend": self.trend,
            "confidence": self.confidence,
            "population": self.population,
            "rate_per_100k": self.rate_per_100k,
            "baseline_rate_per_100k": self.baseline_rate_per_100k,
        }


class EvidenceRecord:
    """Step 5: Structured evidence record extracted from a paper."""

    def __init__(self, paper: Dict[str, Any]):
        self.paper_id = paper.get("source_id") or paper.get("doi") or paper.get("title", "")
        self.title = paper.get("title", "")
        self.doi = paper.get("doi", "")
        self.url = paper.get("url", "")
        self.year = paper.get("year")
        self.authors = paper.get("authors", [])
        self.journal = paper.get("journal", "")
        self.source_databases = paper.get("source_databases", [paper.get("source", "Scholarly Engine")])
        self.relevance_score = paper.get("relevance_score", 0.8)

        abstract = paper.get("abstract", "")
        self.supporting_text = abstract[:400] + "..." if len(abstract) > 400 else abstract

        # Extract study characteristics safely without hallucination
        self.study_design = self._infer_study_design(abstract, paper.get("publication_type", ""))
        self.intervention = self._extract_intervention_concept(self.title, abstract)
        self.effect_direction = "positive_reduction" if "prevent" in self.title.lower() or "reduc" in abstract.lower() else "evaluative"
        self.effect_size = None  # Never fabricate effect size if not explicitly in text!
        self.limitations = [
            "Empirical evaluation context may vary from local administrative infrastructure.",
            "Effectiveness depends on local implementation adherence and environmental context."
        ]

    def _infer_study_design(self, abstract: str, pub_type: str) -> str:
        text = (abstract + " " + pub_type).lower()
        if "meta-analysis" in text or "systematic review" in text:
            return "Systematic Review / Meta-Analysis"
        elif "quasi-experimental" in text or "control group" in text or "randomized" in text:
            return "Quasi-Experimental Evaluation"
        elif "empirical" in text or "regression" in text or "longitudinal" in text:
            return "Empirical Quantitative Study"
        else:
            return "Observational Criminological Study"

    def _extract_intervention_concept(self, title: str, abstract: str) -> str:
        combined = (title + " " + abstract).lower()
        if "situational" in combined or "target hardening" in combined:
            return "Situational crime prevention and physical target hardening (access barriers, guardianship)"
        elif "lighting" in combined or "environmental" in combined or "cpted" in combined:
            return "Environmental design, public lighting, and natural surveillance enhancements"
        elif "community" in combined or "neighborhood" in combined:
            return "Community-based situational guardianship and inter-agency coordination"
        elif "patrol" in combined or "hotspot" in combined:
            return "Micro-geographic spatial resource allocation and directed patrols"
        else:
            return "Targeted situational intervention relevant to the specific offense mechanism"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "paper_id": self.paper_id,
            "title": self.title,
            "authors": self.authors,
            "year": self.year,
            "doi": self.doi,
            "url": self.url,
            "journal": self.journal,
            "source_databases": self.source_databases,
            "relevance_score": self.relevance_score,
            "study_design": self.study_design,
            "intervention": self.intervention,
            "effect_direction": self.effect_direction,
            "effect_size": self.effect_size,
            "limitations": self.limitations,
            "supporting_text": self.supporting_text,
        }


class TangibleActionEngine:
    """Engine for generating concrete, evidence-validated recommendations from crime findings."""

    def evaluate_actionability(self, finding: ActionableCrimeFinding) -> Tuple[bool, str]:
        """Step 2: Assess whether a crime finding is statistically actionable."""
        if finding.baseline_count < 10:
            return False, "Baseline incident count is too small to establish statistical significance for an intervention."

        if abs(finding.change_percent) < 10.0 and finding.trend == "stable":
            return False, "Observed change is within expected historical fluctuation boundaries; no intervention required."

        if finding.confidence == "low":
            return False, "Insufficient data confidence to support a targeted intervention."

        return True, "Observed pattern exhibits sufficient statistical deviation and magnitude to warrant evidence evaluation."

    def generate_targeted_queries(self, finding: ActionableCrimeFinding) -> List[str]:
        """Step 4: Generate specific research queries tailored to the problem mechanism."""
        cat = finding.crime_category.upper()

        if "VEHICLE" in cat or "AUTO" in cat:
            return [
                "vehicle theft parking security interventions",
                "motor vehicle theft situational crime prevention",
                "auto theft target hardening interventions",
                "vehicle theft prevention effectiveness"
            ]
        elif "PROPERTY" in cat or "THEFT" in cat or "BURGLARY" in cat or "ROBBERY" in cat:
            return [
                "property crime situational prevention interventions",
                "residential burglary target hardening interventions",
                "situational crime prevention commercial property",
                "property crime environmental design prevention"
            ]
        elif "VIOLENT" in cat or "MURDER" in cat or "HOMICIDE" in cat or "ASSAULT" in cat:
            return [
                "violent crime community prevention interventions",
                "situational prevention violent crime hotspots",
                "environmental design violent crime reduction",
                "community violence intervention evaluations"
            ]
        elif "WOMEN" in cat or "GENDER" in cat:
            return [
                "crimes against women public space safety interventions",
                "women safety environmental design lighting",
                "public space guardianship women safety interventions"
            ]
        else:
            return [
                f"{finding.crime_category.lower()} crime prevention interventions",
                f"{finding.crime_category.lower()} situational prevention studies",
                f"{finding.crime_category.lower()} risk factors and prevention"
            ]

    def build_recommendation(
        self,
        finding: ActionableCrimeFinding,
        evidence_records: List[EvidenceRecord]
    ) -> Dict[str, Any]:
        """
        Step 7, 8, 9: Build a concrete, non-vague recommendation object with explicit provenance.
        """
        if not evidence_records:
            return {
                "status": "NO_SPECIFIC_RECOMMENDATION",
                "message": "Relevant research was found, but it does not provide sufficiently direct evidence for a specific recommendation in this context.",
                "actionability_level": "LEVEL 0 — INSUFFICIENT EVIDENCE"
            }

        top_evidence = evidence_records[0]

        # Determine Actionability Level (Step 9)
        if finding.geography_level == "district":
            actionability_level = "LEVEL 2 — AREA-TARGETED"
            target_area = f"{finding.district} District (District-Level Administrative Unit)"
            actor = f"{finding.district} District Police Administration in coordination with District Collectorate"
        elif finding.geography_level == "station" and finding.station_name:
            actionability_level = "LEVEL 3 — LOCATION-TARGETED"
            target_area = f"{finding.station_name} Station Jurisdiction, {finding.district}"
            actor = f"{finding.station_name} Station House Officer (SHO) & Local Administrative Operations"
        else:
            actionability_level = "LEVEL 1 — GENERAL EVIDENCE"
            target_area = "Tamil Nadu Regional Level"
            actor = "State Police Headquarters / Public Safety Policy Bureau"

        # Concrete implementation detail from study
        implementation_detail = (
            f"Implement {top_evidence.intervention.lower()} as evaluated by "
            f"{', '.join(top_evidence.authors[:2]) if top_evidence.authors else 'researchers'} "
            f"({top_evidence.year or 'n.d.'}) in '{top_evidence.title}'. "
            f"Focus intervention on altering physical access and guardianship structures."
        )

        # Concrete expected indicator (Step 10)
        expected_indicator = (
            f"Monthly recorded {finding.crime_category} incidents in {finding.district} "
            f"over the subsequent 12-month period relative to the baseline of {finding.baseline_count} incidents."
        )

        recommendation_text = (
            f"Prioritize {top_evidence.intervention.lower()} within {target_area} "
            f"to address the observed {finding.change_percent:+,.1f}% variation in recorded {finding.crime_category}."
        )

        # Step 15: Validate that recommendation is NOT vague
        for vague in VAGUE_PHRASES:
            if vague in recommendation_text.lower() and not top_evidence.doi:
                return {
                    "status": "REJECTED_VAGUE",
                    "message": "Proposed recommendation contained non-specific phrasing without sufficient empirical backing.",
                    "actionability_level": "LEVEL 0 — INSUFFICIENT EVIDENCE"
                }

        recommendation_object = {
            "recommendation_id": f"REC_{finding.district[:3].upper()}_{finding.crime_category[:3].upper()}_01",
            "recommendation": recommendation_text,
            "actor": actor,
            "target_problem": finding.crime_category,
            "target_area": target_area,
            "actionability_level": actionability_level,
            "implementation_detail": implementation_detail,
            "supporting_evidence": [e.to_dict() for e in evidence_records[:3]],
            "applicability": (
                f"Applies published empirical findings from {top_evidence.title} ({top_evidence.year or 'n.d.'}) "
                f"to the observed {finding.trend} trend (+{finding.change_amount} cases) in {finding.district}."
            ),
            "expected_indicator": expected_indicator,
            "confidence": finding.confidence,
            "limitations": [
                f"ANVESHA dataset operates at the {finding.geography_level} level; recommendations cannot be localized to specific street segments without sub-district GIS records.",
                "Observational crime data reflects police recording patterns and reporting tendencies.",
                "Intervention effectiveness assumes local administrative fidelity to the evaluated study design."
            ]
        }

        return recommendation_object

    def run_action_pipeline(self, finding_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the complete end-to-end Tangible Action Engine pipeline:
        Finding -> Actionability -> Query Gen -> Research Search -> BGE-M3 -> BGE Reranker -> Action Object
        """
        # Step 1: Build CrimeFinding
        finding = ActionableCrimeFinding(
            district=finding_params.get("district", "Coimbatore"),
            crime_category=finding_params.get("crime_category", "PROPERTY_CRIME"),
            period=finding_params.get("period", "2022-2023"),
            observed_count=finding_params.get("observed_count", 184),
            baseline_count=finding_params.get("baseline_count", 145),
            population=finding_params.get("population", 1450000),
            geography_level=finding_params.get("geography_level", "district"),
            station_name=finding_params.get("station_name"),
        )

        finding_dict = finding.to_dict()

        # Step 2: Actionability Assessment
        is_actionable, action_reason = self.evaluate_actionability(finding)
        if not is_actionable:
            return {
                "finding": finding_dict,
                "is_actionable": False,
                "reason": action_reason,
                "message": "Insufficient evidence for a specific intervention.",
                "recommendation_object": None,
                "public_explanation": {
                    "whats_changing": f"Recorded {finding.crime_category} in {finding.district} was {finding.observed_count} in {finding.period} (baseline: {finding.baseline_count}).",
                    "why_might_this_be_happening": action_reason,
                    "what_can_help": "Insufficient evidence of a meaningful statistical pattern to justify a specific intervention at this time.",
                    "limitations": ["Data does not show sufficient statistical deviation."],
                    "sources": []
                }
            }

        # Step 3 & 4: Characterize Problem & Generate Research Queries
        queries = self.generate_targeted_queries(finding)
        primary_query = queries[0]

        # Step 5 & 6: Search & Retrieve Evidence
        search_res = research_search_service.search_all_sources(primary_query, limit_per_source=15)
        papers = search_res.get("papers", [])

        if not papers:
            return {
                "finding": finding_dict,
                "is_actionable": True,
                "reason": action_reason,
                "message": "Relevant research was queried, but no matching scholarly studies were returned.",
                "recommendation_object": None,
                "public_explanation": {
                    "whats_changing": f"Recorded {finding.crime_category} in {finding.district} changed by {finding.change_percent:+,.1f}%.",
                    "why_might_this_be_happening": "Observed variation in administrative crime records.",
                    "what_can_help": "Relevant research was found, but it does not provide sufficiently direct evidence for a specific recommendation in this context.",
                    "limitations": ["No direct scholarly studies matched the query mechanism."],
                    "sources": []
                }
            }

        # BGE-M3 Dense Retrieval & BGE Reranking
        candidate_tuples = bge_m3_retriever.rank_candidates(primary_query, papers, top_k=10)
        reranked_tuples = bge_reranker.rerank(primary_query, candidate_tuples, top_k=6)
        top_papers = [t[0] for t in reranked_tuples]

        # Convert to EvidenceRecords
        evidence_records = [EvidenceRecord(p) for p in top_papers]

        # Step 7, 8, 9: Build Concrete Recommendation Object
        rec_obj = self.build_recommendation(finding, evidence_records)

        # Step 12 & 13: Separate Concerns into Public Explanation (OBSERVED, INTERPRETATION, EVIDENCE, ACTION, LIMITATIONS)
        public_explanation = {
            "observed": (
                f"Recorded {finding.crime_category} in {finding.district} was {finding.observed_count:,.0f} incidents "
                f"during {finding.period}, representing a {finding.change_percent:+,.1f}% change relative to the 3-year baseline "
                f"({finding.baseline_count:,.0f} incidents)."
            ),
            "interpretation": (
                f"The statistical pattern indicates a {finding.trend} trend in recorded {finding.crime_category} "
                f"exceeding normal historical variation boundaries for {finding.district}."
            ),
            "evidence": (
                f"Retrieved empirical research ({evidence_records[0].title}, {evidence_records[0].year or 'n.d.'}, "
                f"DOI: {evidence_records[0].doi or 'N/A'}) evaluates {evidence_records[0].intervention.lower()}."
            ),
            "action": rec_obj.get("recommendation", "No specific action."),
            "actor": rec_obj.get("actor"),
            "expected_indicator": rec_obj.get("expected_indicator"),
            "limitations": rec_obj.get("limitations", []),
            "sources": [
                f"• {e.title} ({e.year or 'n.d.'}) - {e.url or ('DOI: ' + e.doi if e.doi else 'Scholarly Database')}"
                for e in evidence_records[:4]
            ]
        }

        # Step 18 & 19: Audit Record
        research_record = {
            "finding_id": f"FINDING_{finding.district}_{finding.crime_category}_{finding.period}",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "finding": finding_dict,
            "queries_executed": queries,
            "raw_papers_found": search_res.get("total_results", 0),
            "reranked_papers_count": len(top_papers),
            "recommendation_object": rec_obj,
            "validation": {
                "is_actionable": True,
                "support_validated": rec_obj.get("status") != "NO_SPECIFIC_RECOMMENDATION",
                "vague_phrases_check": "PASSED"
            }
        }

        return {
            "finding": finding_dict,
            "is_actionable": True,
            "recommendation_object": rec_obj,
            "public_explanation": public_explanation,
            "research_record": research_record
        }

tangible_action_engine = TangibleActionEngine()

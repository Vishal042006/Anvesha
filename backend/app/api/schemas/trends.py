from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TrendItem(BaseModel):
    district: str
    crime_category: str
    current_value: Optional[float] = None
    previous_value: Optional[float] = None
    percentage_change: Optional[float] = None
    trend: str  # INCREASING, STABLE, DECREASING, UNAVAILABLE
    trend_eligibility_reason: str = "VALID_PREVIOUS_YEAR" # VALID_PREVIOUS_YEAR, MISSING_PREVIOUS_YEAR, ZERO_PREVIOUS_COUNT
    trend_eligible: bool = True
    threshold_pct: float = 5.0
    model: str = "RandomForestClassifier (Lag1 + Lag2 + Lag3 + Rolling3 + Momentum)"
    data_type: str = "DERIVED_STATISTIC"
    provenance_type: str = "OFFICIAL_OBSERVED"
    source_provenance: str = "NCRB Official District Panel (2001-2014)"

class TrendResponse(BaseModel):
    total: int
    trends: List[TrendItem]
    evaluation_summary: Dict[str, Any] = {
        "accuracy": 0.6651,
        "macro_f1": 0.4798,
        "test_observations": 639,
        "limitations": "RandomForest trend classifier evaluated on candidate extended panel (2021-2023)."
    }


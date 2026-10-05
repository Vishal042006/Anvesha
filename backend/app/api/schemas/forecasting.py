from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ForecastRequest(BaseModel):
    district: str
    crime_category: str
    year: int = 2024
    model: str = "3-Year Rolling Mean Baseline"

class FeatureContribution(BaseModel):
    feature: str
    value: float
    contribution: float
    direction: str

class TrackEvaluationMetrics(BaseModel):
    name: str
    evaluation_period: str
    sample_count: int
    source_provenance: str
    metrics: Dict[str, float]
    limitations: str

class ForecastResponse(BaseModel):
    district: str
    crime_category: str
    prediction_year: int
    status: str = "SUCCESS" # "SUCCESS" or "INSUFFICIENT_HISTORY"
    status_message: Optional[str] = None
    predicted_count: Optional[float] = None
    predicted_rate: Optional[float] = None
    model: str = "3-Year Rolling Mean Baseline"
    model_version: str = "ANVESHA_V2_AUDITED"
    training_period: str = "2002-2017"
    data_type: str = "MODEL_FORECAST"
    input_provenance: str = "SYNTHETIC_CANDIDATE_ESTIMATE (2015-2023)"
    lags_used: Dict[str, Optional[float]] = {}
    uncertainty_available: bool = False
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    explanations: List[FeatureContribution] = []
    data_sources: List[str] = ["NCRB Official Panel (2001-2014)", "SCRB Candidate Extensions (2015-2023)"]
    provenance_id: str = "PROV-TN-2024-001"
    evaluation_summary: Dict[str, Any] = {}
    limitations_disclaimer: str = (
        "Track B WAPE (2.80%) reflects synthetic candidate extension evaluation and must NOT be cited as "
        "verified real-world forecasting accuracy. Track A (WAPE 20.01%) represents true baseline performance on official NCRB observations."
    )

class BulkForecastRequest(BaseModel):
    districts: List[str]
    crime_categories: List[str]
    year: int = 2024
    model: str = "3-Year Rolling Mean Baseline"

class BulkForecastResponse(BaseModel):
    results: List[ForecastResponse]


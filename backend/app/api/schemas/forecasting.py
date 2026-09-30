from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ForecastRequest(BaseModel):
    district: str
    crime_category: str
    year: int = 2024
    model: str = "RandomForestRegressor"

class FeatureContribution(BaseModel):
    feature: str
    value: float
    contribution: float
    direction: str

class ForecastResponse(BaseModel):
    district: str
    crime_category: str
    prediction_year: int
    predicted_count: float
    predicted_rate: Optional[float] = None
    model: str
    model_version: str = "2.0.0"
    training_period: str = "2001-2017"
    uncertainty_available: bool = False
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    explanations: List[FeatureContribution] = []
    data_sources: List[str] = ["SCRB Tamil Nadu", "NCRB India"]
    provenance_id: str = "PROV-TN-2024-001"

class BulkForecastRequest(BaseModel):
    districts: List[str]
    crime_categories: List[str]
    year: int = 2024
    model: str = "RandomForestRegressor"

class BulkForecastResponse(BaseModel):
    results: List[ForecastResponse]

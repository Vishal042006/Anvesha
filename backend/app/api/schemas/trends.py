from pydantic import BaseModel
from typing import List, Optional

class TrendItem(BaseModel):
    district: str
    crime_category: str
    current_value: float
    previous_value: float
    percentage_change: float
    trend: str  # INCREASING, STABLE, DECREASING
    threshold_pct: float = 5.0
    model: str = "RandomForestClassifier"

class TrendResponse(BaseModel):
    total: int
    trends: List[TrendItem]

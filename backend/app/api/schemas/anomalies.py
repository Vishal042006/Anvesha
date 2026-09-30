from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnomalyItem(BaseModel):
    district: str
    year: int
    crime_category: str
    observed_count: float
    historical_baseline: float
    anomaly_score: float
    anomaly_flag: bool
    anomaly_method: str = "IsolationForest"
    supporting_features: Dict[str, Any] = {}
    provenance_id: str = "PROV-ANOM-001"

class AnomalyResponse(BaseModel):
    total_anomalies: int
    anomalies: List[AnomalyItem]

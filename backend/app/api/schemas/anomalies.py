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
    data_type: str = "STATISTICAL_ANOMALY_FLAG"
    provenance_type: str = "OFFICIAL_OBSERVED" # "OFFICIAL_OBSERVED" or "SYNTHETIC_CANDIDATE_ESTIMATE"
    source_provenance: str = "NCRB Official District Panel (2001-2014)"
    supporting_features: Dict[str, Any] = {}
    provenance_id: str = "PROV-ANOM-001"
    legal_disclaimer: str = (
        "Statistical anomaly flags indicate aggregate population volume trajectory outliers, NOT evidence of individual wrongdoing or official misconduct."
    )

class AnomalyResponse(BaseModel):
    total_anomalies: int
    anomalies: List[AnomalyItem]
    evaluation_metrics: Dict[str, Any] = {
        "train_observations": 2517,
        "test_observations": 639,
        "anomalies_detected": 24,
        "anomaly_rate_pct": 3.76,
        "limitations": "IsolationForest trained on 2002-2017 features. Flags statistical volume trajectory outliers, not evidence of wrongdoing by an individual."
    }


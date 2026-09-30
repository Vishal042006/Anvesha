from pydantic import BaseModel
class PredictionRequest(BaseModel):
    district: str
    crime_category: str
    year: int = 2024

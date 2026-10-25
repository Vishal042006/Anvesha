"""
ANVESHA 2.0 — SPATIAL GEOGRAPHIC SCHEMAS
Production-grade Pydantic schemas for GeoJSON maps, spatial summary, unit details, and levels.
"""

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field


class SpatialLevel(BaseModel):
    code: str = Field(..., description="Level identifier (state, district, police_unit, police_station)")
    label: str = Field(..., description="Human-readable level title")
    description: str = Field(..., description="Level description")


class SpatialLevelsResponse(BaseModel):
    levels: List[SpatialLevel]
    default_level: str = "police_unit"


class CrimeCategoryItem(BaseModel):
    code: str = Field(..., description="Category code (e.g. ALL_CRIME, MURDER, PROPERTY)")
    label: str = Field(..., description="Human-readable category label")
    description: Optional[str] = None


class SpatialCategoriesResponse(BaseModel):
    categories: List[CrimeCategoryItem]
    default_category: str = "ALL_CRIME"


class MapFeatureProperties(BaseModel):
    geography_id: str
    geography_level: str
    name: str
    reporting_unit: str
    display_name: str
    district: str
    state_ut: str
    data_year: int
    data_available: bool = True
    crime_count: Optional[int] = None
    crime_rate_per_100k: Optional[float] = None
    population: Optional[int] = None
    population_provenance: Optional[str] = None
    current_regime: Optional[str] = None
    regime_probability: Optional[float] = None
    regime_provenance: Optional[str] = None
    change_point_detected: Optional[bool] = None
    change_point_year: Optional[int] = None
    change_point_probability: Optional[float] = None
    change_point_method: Optional[str] = None
    forecast_available: bool = False
    forecast_year: Optional[int] = None
    forecast_value: Optional[float] = None
    forecast_lower: Optional[float] = None
    forecast_upper: Optional[float] = None
    forecast_provenance: Optional[str] = None
    provenance: str = "OBSERVED"
    
    # Backwards-compatibility properties
    canonical_unit_id: Optional[str] = None
    observed_2023: Optional[int] = None
    model: Optional[str] = None
    status: Optional[str] = None
    forecast_concern: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: Dict[str, Any]


class SpatialMapMetadata(BaseModel):
    level: str
    year: int
    metric: str
    crime_category: str
    unit_count: int
    source: str
    geography_basis: str
    provenance: str
    disclaimer: str


class SpatialMapResponse(BaseModel):
    type: str = "FeatureCollection"
    metadata: SpatialMapMetadata
    features: List[Dict[str, Any]]


class SpatialSummaryResponse(BaseModel):
    level: str
    year: int
    crime_category: str
    total_units: int
    units_with_data: int
    units_missing_data: int
    mean_crime: Optional[float] = None
    median_crime: Optional[float] = None
    min_crime: Optional[float] = None
    max_crime: Optional[float] = None
    highest_unit: Optional[str] = None
    lowest_unit: Optional[str] = None
    regime_distribution: Dict[str, int] = {}
    change_points_count: int = 0
    provenance_breakdown: Dict[str, int] = {}


class CrimeHistoryPoint(BaseModel):
    year: int
    crime_count: Optional[int] = None
    regime: Optional[str] = None
    provenance: str = "OBSERVED"


class ForecastHorizonPoint(BaseModel):
    year: int
    value: float
    lower: Optional[float] = None
    upper: Optional[float] = None


class UnitForecastDetails(BaseModel):
    forecast_available: bool = False
    forecast_model: Optional[str] = None
    horizons: List[ForecastHorizonPoint] = []
    provenance: str = "FORECAST"


class GeographyUnitMetadata(BaseModel):
    geography_id: str
    name: str
    district: str
    state_ut: str
    type: str
    geography_basis: str = "historically_harmonized"


class UnitCurrentStatus(BaseModel):
    latest_year: int
    latest_crime_count: Optional[int] = None
    current_regime: Optional[str] = None
    regime_probability: Optional[float] = None
    bocpd_change_point_year: Optional[int] = None
    pelt_change_point_year: Optional[int] = None
    change_point_probability: Optional[float] = None
    change_point_direction: Optional[str] = None


class UnitDetailsResponse(BaseModel):
    geography: GeographyUnitMetadata
    current_status: UnitCurrentStatus
    crime_history: List[CrimeHistoryPoint]
    forecast: UnitForecastDetails
    provenance: Dict[str, str]

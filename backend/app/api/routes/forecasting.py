from fastapi import APIRouter, Query
from backend.app.api.schemas.forecasting import ForecastRequest, ForecastResponse, BulkForecastRequest, BulkForecastResponse
from backend.app.services.forecasting_service import forecasting_service

router = APIRouter()

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    district: str = Query("CHENNAI", description="District name"),
    crime_category: str = Query("PROPERTY_CRIME", description="Crime category"),
    year: int = Query(2024, description="Forecast target year"),
    model: str = Query("RandomForestRegressor", description="Model name")
):
    return forecasting_service.forecast(district, crime_category, year, model)

@router.get("/forecast/{district}", response_model=ForecastResponse)
def get_forecast_by_district(
    district: str,
    crime_category: str = Query("PROPERTY_CRIME", description="Crime category"),
    year: int = Query(2024, description="Forecast target year"),
    model: str = Query("RandomForestRegressor", description="Model name")
):
    return forecasting_service.forecast(district, crime_category, year, model)

@router.post("/forecast", response_model=ForecastResponse)
def post_forecast(req: ForecastRequest):
    return forecasting_service.forecast(req.district, req.crime_category, req.year, req.model)

@router.post("/forecast/bulk", response_model=BulkForecastResponse)
def bulk_forecast(req: BulkForecastRequest):
    results = []
    for d in req.districts:
        for c in req.crime_categories:
            res = forecasting_service.forecast(d, c, req.year, req.model)
            results.append(res)
    return {"results": results}

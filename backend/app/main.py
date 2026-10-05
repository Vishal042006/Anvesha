from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings

from backend.app.api.routes import health, forecasting, anomalies, trends, analytics, spatial, evidence, models, explain, research, classification, risk

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ANVESHA Research AI Platform API - Crime Intelligence, Forecasting, Trends, Anomalies, Evidence Retrieval, and Scholarly Synthesis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(models.router, prefix=settings.API_V1_STR, tags=["Model Registry"])
app.include_router(classification.router, prefix=settings.API_V1_STR, tags=["Classification"])
app.include_router(forecasting.router, prefix=settings.API_V1_STR, tags=["Forecasting"])
app.include_router(anomalies.router, prefix=settings.API_V1_STR, tags=["Anomalies"])
app.include_router(risk.router, prefix=settings.API_V1_STR, tags=["Risk Indication Engine"])
app.include_router(trends.router, prefix=settings.API_V1_STR, tags=["Trends"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["District Analytics"])
app.include_router(spatial.router, prefix=settings.API_V1_STR, tags=["Spatial Analysis"])
app.include_router(evidence.router, prefix=settings.API_V1_STR, tags=["Evidence Retrieval"])
app.include_router(explain.router, prefix=settings.API_V1_STR, tags=["Explainability"])
app.include_router(research.router, prefix=settings.API_V1_STR, tags=["Scholarly Research"])

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1_health": f"{settings.API_V1_STR}/health"
    }

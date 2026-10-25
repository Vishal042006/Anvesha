import sys
from pathlib import Path

# Add project root and backend directory to sys.path so imports work from both root and backend/
_backend_dir = Path(__file__).resolve().parent.parent
_project_root = _backend_dir.parent
for _p in [str(_project_root), str(_backend_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings

from backend.app.api.routes import health, forecasting, anomalies, trends, analytics, spatial, evidence, models, explain, research, classification, risk, crimeshift, news, briefing

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ANVESHA Research AI Platform API - Crime Intelligence, Forecasting, Trends, Anomalies, Evidence Retrieval, Scholarly Synthesis, News, and District Intelligence Briefing"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(crimeshift.router, prefix=settings.API_V1_STR, tags=["CRIME-SHIFT Research Engine"])
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
app.include_router(news.router, prefix=settings.API_V1_STR, tags=["News Intelligence"])
app.include_router(briefing.router, prefix=settings.API_V1_STR, tags=["District Intelligence Briefing"])

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1_health": f"{settings.API_V1_STR}/health"
    }

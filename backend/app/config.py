import os
from pathlib import Path

# Always anchor to the project root directory
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

try:
    from dotenv import load_dotenv
    load_dotenv(_PROJECT_ROOT / ".env")
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = "ANVESHA Research AI Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    PROJECT_ROOT: str = str(_PROJECT_ROOT)
    DATA_DIR: str = str(_PROJECT_ROOT / "data")
    MODELS_DIR: str = str(_PROJECT_ROOT / "models")
    OUTPUTS_DIR: str = str(_PROJECT_ROOT / "outputs")
    ANVESHA_OUTPUTS_DIR: str = str(_PROJECT_ROOT / "anvesha_outputs")

    # API Credentials for Scholarly Research Engine
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    OPENALEX_API_KEY: str = os.getenv("OPENALEX_API_KEY", "")
    SEMANTIC_SCHOLAR_API_KEY: str = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")
    CROSSREF_EMAIL: str = os.getenv("CROSSREF_EMAIL", "")

settings = Settings()

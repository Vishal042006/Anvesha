import os

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.abspath(".env"))
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
    DATA_DIR: str = os.path.abspath("data")
    MODELS_DIR: str = os.path.abspath("models")

    # API Credentials for Scholarly Research Engine
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    OPENALEX_API_KEY: str = os.getenv("OPENALEX_API_KEY", "")
    SEMANTIC_SCHOLAR_API_KEY: str = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")
    CROSSREF_EMAIL: str = os.getenv("CROSSREF_EMAIL", "")

settings = Settings()

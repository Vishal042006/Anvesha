import os

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

settings = Settings()

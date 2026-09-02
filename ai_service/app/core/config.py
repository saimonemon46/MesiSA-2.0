from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "MediSA AI Reasoning Service"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    
    # Internal Security (Rules 5 & 6)
    INTERNAL_AI_SECRET: str = "medisa-internal-ai-secret-key"
    LARAVEL_API_BASE_URL: str = "http://localhost:8000/api/v1"
    
    # AI Providers (Rule 14)
    PRIMARY_LLM_PROVIDER: str = "gemini"
    FALLBACK_LLM_PROVIDER: str = "openai"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # AI Circuit Breaker & Safety Thresholds
    CIRCUIT_BREAKER_MAX_FAILURES: int = 3
    CIRCUIT_BREAKER_RESET_TIMEOUT_SEC: int = 60
    OCR_CONFIDENCE_THRESHOLD: float = 0.85 # Rule 15


settings = Settings()

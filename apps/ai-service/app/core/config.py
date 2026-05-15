from pydantic import Field, field_validator
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables from .env file explicitly
load_dotenv()


class Settings(BaseSettings):
    app_name: str = os.environ.get("APP_NAME", "ElimuSight AI Service")
    app_version: str = os.environ.get("APP_VERSION", "1.0.0")
    debug: bool = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes")

    api_prefix: str = "/api/v1"

    openai_api_key: Optional[str] = os.environ.get("OPENAI_API_KEY")
    openai_model: str = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    openai_max_tokens: int = int(os.environ.get("OPENAI_MAX_TOKENS", "2048"))
    openai_temperature: float = float(os.environ.get("OPENAI_TEMPERATURE", "0.3"))
    openai_request_timeout: int = int(os.environ.get("OPENAI_REQUEST_TIMEOUT", "30"))
    openai_retry_max_attempts: int = 3
    openai_retry_base_delay: float = 1.0

    cors_origins: str = Field(default=os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"))
    rate_limit_per_minute: int = int(os.environ.get("RATE_LIMIT_PER_MINUTE", "30"))

    log_level: str = os.environ.get("LOG_LEVEL", "INFO")
    log_json: bool = os.environ.get("LOG_JSON", "True").lower() in ("true", "1", "yes")

    sentry_dsn: Optional[str] = os.environ.get("SENTRY_DSN")

    cache_ttl_seconds: int = int(os.environ.get("CACHE_TTL_SECONDS", "120"))
    redis_url: Optional[str] = os.environ.get("REDIS_URL")

    enable_llm: bool = os.environ.get("ENABLE_LLM", "True").lower() in ("true", "1", "yes")
    enable_ml: bool = os.environ.get("ENABLE_ML", "True").lower() in ("true", "1", "yes")

    max_request_body_size: int = 1_048_576

    max_daily_tokens: int = int(os.environ.get("MAX_DAILY_TOKENS", "1000000"))
    max_daily_cost_usd: float = float(os.environ.get("MAX_DAILY_COST_USD", "5.0"))
    llm_model_tier: str = os.environ.get("LLM_MODEL_TIER", "balanced")

    @field_validator("openai_api_key", mode="before")
    @classmethod
    def warn_missing_openai_key(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            v = os.environ.get("OPENAI_API_KEY")
        
        if not v or v == "None":
            import warnings
            warnings.warn("OPENAI_API_KEY not set. LLM features will be disabled.")
            return None
        return v

    @field_validator("debug", mode="before")
    @classmethod
    def coerce_debug(cls, v: Optional[bool]) -> bool:
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes")
        return bool(v) if v is not None else False

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def llm_enabled(self) -> bool:
        return bool(self.openai_api_key) and self.enable_llm

    def validate_startup(self) -> list[str]:
        warnings_list = []
        if not self.openai_api_key:
            warnings_list.append("OPENAI_API_KEY is not set — LLM features will be disabled")
        if not self.sentry_dsn:
            warnings_list.append("SENTRY_DSN is not set — error tracking will be disabled")
        return warnings_list

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()

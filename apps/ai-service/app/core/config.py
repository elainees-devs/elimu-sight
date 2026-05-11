from pydantic import Field, field_validator
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "ElimuSight AI Service"
    app_version: str = "1.0.0"
    debug: bool = False

    api_prefix: str = "/api/v1"

    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o-mini"
    openai_max_tokens: int = 2048
    openai_temperature: float = 0.3
    openai_request_timeout: int = 30
    openai_retry_max_attempts: int = 3
    openai_retry_base_delay: float = 1.0

    cors_origins: str = Field(default="http://localhost:3000,http://localhost:5173")
    rate_limit_per_minute: int = 30

    log_level: str = "INFO"
    log_json: bool = True

    sentry_dsn: Optional[str] = None

    cache_ttl_seconds: int = 300
    redis_url: Optional[str] = None

    enable_llm: bool = True
    enable_ml: bool = True

    max_request_body_size: int = 1_048_576

    max_daily_tokens: int = 1_000_000
    max_daily_cost_usd: float = 5.0
    llm_model_tier: str = "balanced"

    @field_validator("openai_api_key", mode="before")
    @classmethod
    def warn_missing_openai_key(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            import warnings
            warnings.warn("OPENAI_API_KEY not set. LLM features will be disabled.")
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

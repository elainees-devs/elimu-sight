import json
import time
from typing import Optional
from openai import OpenAI, APIError, APITimeoutError, RateLimitError
from app.core.config import settings
from app.core.logging import logger
from app.utils.http import CircuitBreaker, CircuitBreakerOpenError


class LLMService:
    def __init__(self):
        self.client: Optional[OpenAI] = None
        self._initialized = False
        self._token_usage = {"prompt": 0, "completion": 0, "total": 0, "cost": 0.0}
        self._model_cost_per_1k = {
            "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
            "gpt-4o": {"input": 0.0025, "output": 0.01},
        }
        self._circuit_breaker = CircuitBreaker(
            name="openai",
            failure_threshold=5,
            recovery_timeout=30.0,
        )

        if settings.openai_api_key:
            self.client = OpenAI(
                api_key=settings.openai_api_key,
                timeout=settings.openai_request_timeout,
            )
            self._initialized = True
        else:
            logger.warning("OpenAI API key not configured — LLM service unavailable")

    @property
    def available(self) -> bool:
        return self._initialized and self.client is not None

    @property
    def token_usage(self) -> dict:
        return dict(self._token_usage)

    @property
    def model_name(self) -> str:
        return settings.openai_model

    @property
    def circuit_breaker_state(self) -> str:
        return self._circuit_breaker.get_state()

    def generate_insight(
        self,
        system_prompt: str,
        user_prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> Optional[dict]:
        if not self.available:
            logger.warning("LLM service unavailable — skipping generation")
            return None

        try:
            return self._circuit_breaker.call(lambda: self._execute_generation(
                system_prompt, user_prompt, max_tokens, temperature
            ))
        except CircuitBreakerOpenError:
            logger.warning("OpenAI circuit breaker is open — using fallback")
            return None

    def _execute_generation(
        self,
        system_prompt: str,
        user_prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> Optional[dict]:
        temperature = temperature if temperature is not None else settings.openai_temperature
        max_tokens = max_tokens if max_tokens is not None else settings.openai_max_tokens
        model = settings.openai_model

        for attempt in range(settings.openai_retry_max_attempts):
            try:
                start_time = time.perf_counter()
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                    response_format={"type": "json_object"},
                )
                duration = time.perf_counter() - start_time

                usage = response.usage
                if usage:
                    prompt_tokens = usage.prompt_tokens or 0
                    completion_tokens = usage.completion_tokens or 0
                    self._track_usage(model, prompt_tokens, completion_tokens)

                content = response.choices[0].message.content
                if not content:
                    logger.warning("LLM returned empty content")
                    return None

                result = json.loads(content)

                logger.info("LLM generation completed", extra={
                    "model": model,
                    "duration_ms": round(duration * 1000, 2),
                    "tokens": usage.total_tokens if usage else 0,
                    "attempt": attempt + 1,
                })

                return result

            except json.JSONDecodeError:
                logger.error("LLM response was not valid JSON", extra={"attempt": attempt + 1})
                if attempt == settings.openai_retry_max_attempts - 1:
                    return None
                continue

            except RateLimitError:
                wait = settings.openai_retry_base_delay * (2 ** attempt)
                logger.warning("OpenAI rate limit hit", extra={
                    "attempt": attempt + 1,
                    "wait_seconds": wait,
                })
                if attempt < settings.openai_retry_max_attempts - 1:
                    time.sleep(wait)
                    continue
                return None

            except APITimeoutError:
                logger.warning("OpenAI request timed out", extra={"attempt": attempt + 1})
                if attempt < settings.openai_retry_max_attempts - 1:
                    time.sleep(settings.openai_retry_base_delay)
                    continue
                return None

            except APIError as e:
                logger.error("OpenAI API error", extra={
                    "error": str(e),
                    "attempt": attempt + 1,
                })
                if attempt < settings.openai_retry_max_attempts - 1:
                    time.sleep(settings.openai_retry_base_delay * (2 ** attempt))
                    continue
                return None

        return None

    def _track_usage(self, model: str, prompt_tokens: int, completion_tokens: int):
        cost_table = self._model_cost_per_1k.get(model, self._model_cost_per_1k["gpt-4o-mini"])
        input_cost = (prompt_tokens / 1000) * cost_table["input"]
        output_cost = (completion_tokens / 1000) * cost_table["output"]

        self._token_usage["prompt"] += prompt_tokens
        self._token_usage["completion"] += completion_tokens
        self._token_usage["total"] += prompt_tokens + completion_tokens
        self._token_usage["cost"] += round(input_cost + output_cost, 6)

    def reset_usage_stats(self):
        self._token_usage = {"prompt": 0, "completion": 0, "total": 0, "cost": 0.0}


llm_service = LLMService()

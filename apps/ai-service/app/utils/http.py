import asyncio
import functools
import random
import time
from typing import Any, Callable, Optional, TypeVar

from app.core.logging import logger

F = TypeVar("F", bound=Callable[..., Any])


class CircuitBreaker:
    def __init__(
        self,
        name: str = "default",
        failure_threshold: int = 5,
        recovery_timeout: float = 30.0,
        half_open_max_retries: int = 3,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_retries = half_open_max_retries

        self.state = "CLOSED"
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.half_open_attempts = 0

    def call(self, fn: Callable[[], Any]) -> Any:
        if self.state == "OPEN":
            if time.monotonic() - self.last_failure_time >= self.recovery_timeout:
                logger.info("Circuit breaker transitioning to HALF_OPEN", extra={"breaker": self.name})
                self.state = "HALF_OPEN"
                self.half_open_attempts = 0
            else:
                raise CircuitBreakerOpenError(f"Circuit breaker '{self.name}' is OPEN")

        try:
            result = fn()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure(e)
            raise

    async def call_async(self, fn: Callable[[], Any]) -> Any:
        if self.state == "OPEN":
            if time.monotonic() - self.last_failure_time >= self.recovery_timeout:
                logger.info("Circuit breaker transitioning to HALF_OPEN", extra={"breaker": self.name})
                self.state = "HALF_OPEN"
                self.half_open_attempts = 0
            else:
                raise CircuitBreakerOpenError(f"Circuit breaker '{self.name}' is OPEN")

        try:
            result = await fn()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure(e)
            raise

    def _on_success(self):
        if self.state == "HALF_OPEN":
            self.half_open_attempts += 1
            if self.half_open_attempts >= self.half_open_max_retries:
                logger.info("Circuit breaker closing after successful retries", extra={"breaker": self.name})
                self.state = "CLOSED"
                self.failure_count = 0
                self.half_open_attempts = 0
        else:
            self.state = "CLOSED"
            self.failure_count = 0

    def _on_failure(self, exception: Exception):
        self.failure_count += 1
        self.last_failure_time = time.monotonic()

        if self.state == "HALF_OPEN" or self.failure_count >= self.failure_threshold:
            logger.warning("Circuit breaker opening", extra={
                "breaker": self.name,
                "failure_count": self.failure_count,
                "error": str(exception),
            })
            self.state = "OPEN"

    def reset(self):
        self.state = "CLOSED"
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.half_open_attempts = 0

    def get_state(self) -> str:
        return self.state


class CircuitBreakerOpenError(Exception):
    pass


def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    jitter: bool = True,
    retryable_exceptions: Optional[tuple] = None,
):
    def decorator(func: F) -> F:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except retryable_exceptions or Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        delay = min(base_delay * (2 ** attempt), max_delay)
                        if jitter:
                            delay += random.uniform(0, delay * 0.5)
                        logger.warning("Retry attempt", extra={
                            "function": func.__name__,
                            "attempt": attempt + 1,
                            "max_attempts": max_attempts,
                            "delay_ms": round(delay * 1000),
                            "error": str(e),
                        })
                        time.sleep(delay)
            raise last_exception

        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except retryable_exceptions or Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        delay = min(base_delay * (2 ** attempt), max_delay)
                        if jitter:
                            delay += random.uniform(0, delay * 0.5)
                        logger.warning("Retry attempt", extra={
                            "function": func.__name__,
                            "attempt": attempt + 1,
                            "max_attempts": max_attempts,
                            "delay_ms": round(delay * 1000),
                            "error": str(e),
                        })
                        await asyncio.sleep(delay)
            raise last_exception

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return wrapper

    return decorator

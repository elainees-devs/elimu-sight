import time
import hashlib
from collections import defaultdict
from collections.abc import Awaitable, Callable
from typing import Optional

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.logging import logger


class RateLimiter:
    def __init__(self, requests_per_minute: int = 30):
        self.requests_per_minute = requests_per_minute
        self._windows: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        window_start = now - 60.0
        self._windows[key] = [t for t in self._windows[key] if t > window_start]

        if len(self._windows[key]) >= self.requests_per_minute:
            retry_after = int(60.0 - (now - self._windows[key][0]))
            return False, max(retry_after, 1)

        self._windows[key].append(now)
        return True, 0

    def get_client_key(self, request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For", "")
        client_ip = forwarded.split(",")[0].strip() if forwarded else request.client.host if request.client else "unknown"
        return hashlib.sha256(client_ip.encode()).hexdigest()[:16]

    def cleanup(self):
        now = time.monotonic()
        cutoff = now - 60.0
        for key in list(self._windows.keys()):
            self._windows[key] = [t for t in self._windows[key] if t > cutoff]
            if not self._windows[key]:
                del self._windows[key]


rate_limiter = RateLimiter(requests_per_minute=settings.rate_limit_per_minute)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        if request.url.path in ("/api/v1/health",):
            return await call_next(request)

        client_key = rate_limiter.get_client_key(request)
        allowed, retry_after = rate_limiter.check(client_key)

        if not allowed:
            logger.warning("Rate limit exceeded", extra={
                "client_key": client_key,
                "path": request.url.path,
            })
            return Response(
                status_code=429,
                content='{"status":"error","message":"Rate limit exceeded. Try again later."}',
                media_type="application/json",
                headers={"Retry-After": str(retry_after), "X-RateLimit-Limit": str(settings.rate_limit_per_minute)},
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(settings.rate_limit_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, settings.rate_limit_per_minute - len(rate_limiter._windows.get(client_key, [])))
        )
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

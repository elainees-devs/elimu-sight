import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.routes import router
from app.core.config import settings
from app.core.logging import logger
from app.core.security import RateLimitMiddleware, SecurityHeadersMiddleware

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Request-ID", "")
        request.state.correlation_id = correlation_id

        logger.info("Request started", extra={
            "correlation_id": correlation_id,
            "method": request.method,
            "path": request.url.path,
        })

        start_time = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception as exc:
            process_time = time.perf_counter() - start_time
            logger.error("Request failed", extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "duration_ms": round(process_time * 1000, 2),
                "error": str(exc),
            })
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": "Internal server error",
                    "correlation_id": correlation_id,
                },
            )

        process_time = time.perf_counter() - start_time
        response.headers["X-Request-ID"] = correlation_id
        response.headers["X-Process-Time-MS"] = str(round(process_time * 1000, 2))

        logger.info("Request completed", extra={
            "correlation_id": correlation_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(process_time * 1000, 2),
        })

        return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "PUT"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)


@app.on_event("startup")
async def startup_event():
    warnings = settings.validate_startup()
    for warning in warnings:
        logger.warning(warning)
    logger.info("Service started", extra={
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "llm_enabled": settings.llm_enabled,
        "ml_enabled": settings.enable_ml,
    })


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    correlation_id = getattr(request.state, "correlation_id", "")
    logger.error("Unhandled exception", extra={
        "correlation_id": correlation_id,
        "path": request.url.path,
        "method": request.method,
        "error": str(exc),
    })
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error",
            "correlation_id": correlation_id,
        },
    )


app.include_router(router, prefix=settings.api_prefix)

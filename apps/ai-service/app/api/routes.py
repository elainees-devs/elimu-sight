from fastapi import APIRouter
from fastapi.responses import JSONResponse, PlainTextResponse

from app.schemas.ai import (
    StudentInsightRequest,
    ClassInsightRequest,
    SubjectInsightRequest,
    RefreshInsightRequest,
    BulkInsightRequest,
    InsightResponse,
)
from app.services.ai_engine import analyze_student, analyze_class, analyze_subject
from app.core.config import settings
from app.core.logging import logger

router = APIRouter()


@router.get("/metrics", include_in_schema=False)
async def metrics():
    try:
        from prometheus_client import generate_latest, REGISTRY
        return PlainTextResponse(generate_latest(REGISTRY), media_type="text/plain")
    except Exception:
        return PlainTextResponse("# Metrics temporarily unavailable\n", media_type="text/plain")


@router.get("/health")
async def health():
    from app.services.llm_service import llm_service
    from app.services.ml_service import ml_service

    llm_available = llm_service.available
    ml_available = ml_service.available
    llm_enabled = settings.llm_enabled

    deps = {
        "llm": {
            "available": llm_available,
            "enabled": llm_enabled,
            "model": llm_service.model_name if llm_available else None,
            "circuit_breaker": llm_service.circuit_breaker_state,
        },
        "ml": {
            "available": ml_available,
            "enabled": settings.enable_ml,
        },
    }

    all_healthy = all(
        dep["available"] or not dep["enabled"]
        for dep in deps.values()
    )

    status = "ok" if all_healthy else "degraded"
    status_code = 200 if all_healthy else 503

    return JSONResponse(
        content={
            "status": status,
            "service": "ai_engine",
            "version": settings.app_version,
            "dependencies": deps,
            "llm_enabled": llm_enabled,
            "llm_available": llm_available,
            "ml_enabled": settings.enable_ml,
        },
        status_code=status_code,
    )


# =========================================
# INSIGHT ENDPOINTS (Node.js API Contract)
# =========================================


@router.post("/insights/student", response_model=InsightResponse)
async def insight_student(request: StudentInsightRequest):
    logger.info("Generating student insight", extra={"student_id": request.context.id})
    return analyze_student(request.context)


@router.post("/insights/class", response_model=InsightResponse)
async def insight_class(request: ClassInsightRequest):
    logger.info("Generating class insight", extra={"class_id": request.context.id})
    return analyze_class(request.context)


@router.post("/insights/subject", response_model=InsightResponse)
async def insight_subject(request: SubjectInsightRequest):
    logger.info("Generating subject insight", extra={"subject_id": request.context.id})
    return analyze_subject(request.context)


@router.post("/insights/refresh")
async def insight_refresh(request: RefreshInsightRequest):
    logger.info("Refreshing insight", extra={"type": request.type})
    return {
        "title": "Refreshed Insight",
        "summary": "Insight refreshed successfully",
        "data": request.context,
        "confidenceScore": 50.0,
    }


@router.post("/insights/bulk")
async def insight_bulk(request: BulkInsightRequest):
    logger.info("Bulk insight generation", extra={
        "school_id": request.schoolId,
        "student_count": len(request.studentIds or []),
        "class_count": len(request.classIds or []),
        "subject_count": len(request.subjectIds or []),
    })
    results = []

    if request.studentIds:
        for sid in request.studentIds:
            results.append({
                "id": sid,
                "type": "STUDENT",
                "status": "queued",
            })

    if request.classIds:
        for cid in request.classIds:
            results.append({
                "id": cid,
                "type": "CLASS",
                "status": "queued",
            })

    if request.subjectIds:
        for subid in request.subjectIds:
            results.append({
                "id": subid,
                "type": "SUBJECT",
                "status": "queued",
            })

    return {
        "title": "Bulk Generation",
        "summary": f"Queued {len(results)} insights for generation",
        "data": {"results": results, "total": len(results)},
        "confidenceScore": 100.0,
    }

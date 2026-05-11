import logging
from fastapi import APIRouter, Depends
from app.schemas.student import StudentRequest
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


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai_engine",
        "version": settings.app_version,
        "llm_enabled": settings.llm_enabled,
        "ml_enabled": settings.enable_ml,
    }


@router.post("/analyze")
async def analyze(data: StudentRequest):
    logger.warning("DEPRECATED: /analyze is deprecated, use /insights/student instead")
    result = analyze_student(data)
    return result


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
    context_dict = request.context.model_dump()
    return analyze_class(context_dict)


@router.post("/insights/subject", response_model=InsightResponse)
async def insight_subject(request: SubjectInsightRequest):
    logger.info("Generating subject insight", extra={"context": request.context.get("id")})
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

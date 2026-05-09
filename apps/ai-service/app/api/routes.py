from fastapi import APIRouter
from app.schemas.student import StudentRequest
from app.services.ai_engine import analyze_student

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "ai_engine", "version": "1.0.0"}

@router.post("/analyze")
def analyze(data: StudentRequest):
    result = analyze_student(data)
    return result
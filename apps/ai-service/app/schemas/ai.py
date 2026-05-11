from pydantic import BaseModel, Field, model_validator
from typing import Any, Optional
from app.schemas.student import Assessment


class InsightResponse(BaseModel):
    title: str
    summary: str
    data: dict[str, Any]
    confidenceScore: float = Field(ge=0.0, le=100.0)


class StudentContext(BaseModel):
    id: str
    school_id: str
    class_id: Optional[str] = None
    full_name: str
    gender: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    assessments: list[Assessment]


class StudentInsightRequest(BaseModel):
    type: str = "STUDENT"
    context: StudentContext


class ClassContext(BaseModel):
    id: str
    name: str
    level: str
    stream: Optional[str] = None
    studentCount: int = 0
    subjectCount: int = 0


class ClassInsightRequest(BaseModel):
    type: str = "CLASS"
    context: ClassContext


class SubjectInsightRequest(BaseModel):
    type: str = "SUBJECT"
    context: dict[str, Any]


class RefreshInsightRequest(BaseModel):
    type: str
    context: dict[str, Any]


class BulkInsightRequest(BaseModel):
    schoolId: str
    studentIds: Optional[list[str]] = None
    classIds: Optional[list[str]] = None
    subjectIds: Optional[list[str]] = None

    @model_validator(mode="after")
    def validate_at_least_one_id_list(self):
        if not self.studentIds and not self.classIds and not self.subjectIds:
            raise ValueError("At least one of studentIds, classIds, or subjectIds must be provided")
        return self

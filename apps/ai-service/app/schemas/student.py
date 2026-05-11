from enum import Enum
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Optional
from app.utils.types import SanitizedString


class ExamType(str, Enum):
    MIDTERM = "midterm"
    FINAL = "final"
    CAT = "cat"
    QUIZ = "quiz"
    ASSIGNMENT = "assignment"
    PRACTICAL = "practical"


class Assessment(BaseModel):
    exam_type: SanitizedString
    term: SanitizedString
    score: float = Field(ge=0)
    total_marks: float = Field(gt=0)

    @model_validator(mode="after")
    def validate_score_not_exceed_total(self):
        if self.score > self.total_marks:
            raise ValueError(f"score ({self.score}) cannot exceed total_marks ({self.total_marks})")
        return self


class StudentRequest(BaseModel):
    id: SanitizedString
    school_id: SanitizedString
    class_id: Optional[SanitizedString] = None
    full_name: SanitizedString = Field(min_length=1, max_length=255)
    gender: Optional[SanitizedString] = None
    guardian_name: Optional[SanitizedString] = None
    guardian_phone: Optional[SanitizedString] = None
    assessments: list[Assessment] = Field(min_length=0)

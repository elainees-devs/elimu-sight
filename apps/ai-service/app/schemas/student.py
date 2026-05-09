from pyandtic import BaseModel
from typing import List,Optional

class Assessment(BaseModel):
    exam_type: str
    term: str
    score: float
    total_marks: float

class StudentRequest(BaseModel):
    id: str
    school_id: str
    full_name: str
    gender: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    assessments: List[Assessment]
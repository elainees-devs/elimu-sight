import os
# Ensure valid placeholder for tests to avoid configuration warnings
os.environ["OPENAI_API_KEY"] = "sk-test-placeholder-key-for-unit-tests"
os.environ["ENABLE_LLM"] = "false"
os.environ["ENABLE_ML"] = "true"
os.environ["LOG_JSON"] = "false"

import pytest
from app.schemas.student import Assessment
from app.schemas.ai import (
    StudentContext,
    StudentInsightRequest,
    ClassInsightRequest,
    ClassContext,
    SubjectContext,
)



@pytest.fixture
def student_context():
    return StudentContext(
        id="s1",
        school_id="sch1",
        class_id="c1",
        full_name="Test Student",
        gender="M",
        guardian_name="Parent",
        guardian_phone="+254700000000",
        assessments=[
            Assessment(exam_type="midterm", term="1", score=80, total_marks=100),
            Assessment(exam_type="midterm", term="2", score=75, total_marks=100),
            Assessment(exam_type="final", term="3", score=85, total_marks=100),
        ],
    )


@pytest.fixture
def low_performing_student():
    return StudentContext(
        id="s2",
        school_id="sch1",
        class_id="c1",
        full_name="At Risk Student",
        assessments=[
            Assessment(exam_type="midterm", term="1", score=30, total_marks=100),
            Assessment(exam_type="midterm", term="2", score=25, total_marks=100),
        ],
    )


@pytest.fixture
def no_data_student():
    return StudentContext(
        id="s3",
        school_id="sch1",
        class_id="c1",
        full_name="No Data Student",
        assessments=[],
    )


@pytest.fixture
def student_request(student_context):
    return StudentInsightRequest(context=student_context)


@pytest.fixture
def class_context():
    return ClassContext(
        id="c1",
        name="Grade 5",
        level="5",
        stream="East",
        studentCount=30,
        subjectCount=8,
    )

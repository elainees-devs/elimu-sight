import pytest
from pydantic import ValidationError
from app.schemas.student import StudentRequest, Assessment
from app.schemas.ai import (
    StudentContext,
    StudentInsightRequest,
    ClassContext,
    ClassInsightRequest,
    SubjectInsightRequest,
    BulkInsightRequest,
    InsightResponse,
)


class TestAssessmentSchema:
    def test_valid_assessment(self):
        a = Assessment(exam_type="midterm", term="1", score=85.0, total_marks=100.0)
        assert a.score == 85.0
        assert a.total_marks == 100.0

    def test_assessment_accepts_negative_score(self):
        a = Assessment(exam_type="midterm", term="1", score=-10, total_marks=100)
        assert a.score == -10


class TestStudentContextSchema:
    def test_valid_student_context(self, student_context):
        assert student_context.full_name == "Test Student"
        assert len(student_context.assessments) == 3

    def test_student_without_optional_fields(self):
        s = StudentContext(id="s1", school_id="sch1", full_name="Test", assessments=[])
        assert s.class_id is None
        assert s.gender is None

    def test_student_without_required_id_fails(self):
        with pytest.raises(ValidationError):
            StudentContext(school_id="sch1", full_name="Test", assessments=[])


class TestInsightResponseSchema:
    def test_valid_response(self):
        r = InsightResponse(
            title="Test",
            summary="Summary",
            data={"key": "value"},
            confidenceScore=85.0,
        )
        assert r.title == "Test"
        assert r.confidenceScore == 85.0

    def test_confidence_score_range(self):
        with pytest.raises(ValidationError):
            InsightResponse(title="Test", summary="", data={}, confidenceScore=150.0)


class TestBulkInsightRequest:
    def test_valid_bulk_request(self):
        req = BulkInsightRequest(
            schoolId="sch1",
            studentIds=["s1", "s2"],
        )
        assert req.schoolId == "sch1"
        assert len(req.studentIds) == 2

    def test_no_ids_provided_fails(self):
        with pytest.raises(ValueError):
            BulkInsightRequest(schoolId="sch1")

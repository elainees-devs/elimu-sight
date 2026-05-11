import pytest
from app.services.ai_engine import (
    analyze_student,
    analyze_class,
    analyze_subject,
    _calculate_risk_score,
    _calculate_trend,
    _evaluate_flags,
    _generate_insight,
)


class TestAnalyzeStudent:
    def test_returns_correct_structure(self, student_context):
        result = analyze_student(student_context)
        assert "title" in result
        assert "summary" in result
        assert "data" in result
        assert "confidenceScore" in result
        assert result["title"] == "Student Performance Analysis"

    def test_calculates_correct_average(self, student_context):
        result = analyze_student(student_context)
        data = result["data"]
        expected_avg = round((80 + 75 + 85) / 3, 2)
        assert data["average"] == expected_avg

    def test_low_performance_high_risk(self, low_performing_student):
        result = analyze_student(low_performing_student)
        data = result["data"]
        assert data["risk_score"] == 0.9
        assert "HIGH_RISK" in data["flags"]

    def test_has_insight_with_personas(self, student_context):
        result = analyze_student(student_context)
        insight = result["data"]["insight"]
        assert "teacher" in insight
        assert "parent" in insight
        assert "student" in insight

    def test_no_data_returns_no_data_flag(self, no_data_student):
        result = analyze_student(no_data_student)
        data = result["data"]
        assert data["flags"] == ["NO_DATA"]
        assert data["average"] == 0
        assert data["risk_score"] == 1.0

    def test_ml_analysis_included(self, student_context):
        result = analyze_student(student_context)
        assert "ml_analysis" in result["data"]
        ml = result["data"]["ml_analysis"]
        assert "trend" in ml
        assert "projected_risk" in ml
        assert "needs_intervention" in ml

    def test_trend_direction_included(self, student_context):
        result = analyze_student(student_context)
        assert "trend_direction" in result["data"]


class TestAnalyzeClass:
    def test_returns_correct_structure(self, class_context):
        result = analyze_class(class_context)
        assert result["title"] == "Class Performance Overview"
        assert result["data"]["studentCount"] == 30
        assert result["data"]["subjectCount"] == 8

    def test_has_insight(self, class_context):
        result = analyze_class(class_context)
        assert "insight" in result["data"]


class TestAnalyzeSubject:
    def test_returns_correct_structure(self):
        result = analyze_subject({
            "id": "sub1",
            "name": "Mathematics",
            "code": "MATH",
            "assessments": [
                {"score": 80, "total_marks": 100},
                {"score": 85, "total_marks": 100},
            ],
        })
        assert result["title"] == "Subject Performance Analysis"
        assert result["data"]["name"] == "Mathematics"
        assert result["data"]["average"] == 82.5

    def test_no_assessments(self):
        result = analyze_subject({"id": "sub1", "name": "Empty", "assessments": []})
        assert result["data"]["average"] == 0
        assert result["data"]["assessment_count"] == 0


class TestRiskScore:
    def test_high_risk(self):
        assert _calculate_risk_score(30) == 0.9

    def test_moderate_risk(self):
        assert _calculate_risk_score(50) == 0.6

    def test_low_risk(self):
        assert _calculate_risk_score(65) == 0.3

    def test_safe(self):
        assert _calculate_risk_score(85) == 0.1


class TestTrend:
    def test_improving(self):
        assert _calculate_trend([50, 60, 70]) == "improving"

    def test_declining(self):
        assert _calculate_trend([70, 60, 50]) == "declining"

    def test_stable(self):
        assert _calculate_trend([60, 61, 60]) == "stable"

    def test_insufficient_data(self):
        assert _calculate_trend([50]) == "insufficient_data"


class TestGenerateInsight:
    def test_high_risk_level(self):
        insight = _generate_insight("Student", 35, 0.9, ["HIGH_RISK"])
        assert "high risk" in insight["teacher"]

    def test_moderate_risk_level(self):
        insight = _generate_insight("Student", 50, 0.6, ["AT_RISK"])
        assert "moderate risk" in insight["teacher"]

    def test_low_risk_level(self):
        insight = _generate_insight("Student", 80, 0.1, [])
        assert "low risk" in insight["teacher"]

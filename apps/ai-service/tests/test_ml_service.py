import pytest
from app.services.ml_service import ml_service


class TestMLService:
    def test_empty_scores(self):
        result = ml_service.analyze_trend([])
        assert result["direction"] == "unknown"

    def test_single_score(self):
        result = ml_service.analyze_trend([75.0])
        assert result["direction"] == "insufficient_data"

    def test_improving_trend(self):
        result = ml_service.analyze_trend([50, 55, 60, 65, 70])
        assert result["direction"] == "improving"
        assert result["slope"] > 0

    def test_declining_trend(self):
        result = ml_service.analyze_trend([70, 65, 60, 55, 50])
        assert result["direction"] == "declining"
        assert result["slope"] < 0

    def test_stable_trend(self):
        result = ml_service.analyze_trend([60, 61, 59, 60, 61])
        assert result["direction"] in ("stable", "improving", "declining")

    def test_projected_next_increasing(self):
        result = ml_service.analyze_trend([50, 60, 70])
        assert result["projected_next"] > 70

    def test_volatility_low(self):
        result = ml_service.analyze_trend([75, 76, 75, 77, 76])
        assert result["consistency"] in ("high", "moderate")


class TestProjectRisk:
    def test_improving_low_risk(self):
        result = ml_service.project_risk([45, 50, 55, 60, 65])
        assert result["projected_risk"] == "low"
        assert result["trend"] == "improving"

    def test_declining_high_risk(self):
        result = ml_service.project_risk([65, 55, 45, 35, 25])
        assert result["projected_risk"] in ("high", "moderate")
        assert result["needs_intervention"] is True

    def test_empty_scores(self):
        result = ml_service.project_risk([])
        assert result["current_average"] == 0
        assert result["projected_average"] is None

    def test_linear_regression_edge_case(self):
        result = ml_service.analyze_trend([50, 50, 50, 50, 50])
        assert result["slope"] == 0.0
        assert result["direction"] == "stable"


class TestLinearRegression:
    def test_perfect_positive(self):
        slope, intercept = ml_service._linear_regression(
            [0, 1, 2, 3, 4], [0, 10, 20, 30, 40]
        )
        assert slope == 10.0

    def test_perfect_negative(self):
        slope, intercept = ml_service._linear_regression(
            [0, 1, 2, 3, 4], [40, 30, 20, 10, 0]
        )
        assert slope == -10.0

    def test_horizontal_line(self):
        slope, intercept = ml_service._linear_regression(
            [0, 1, 2, 3, 4], [50, 50, 50, 50, 50]
        )
        assert slope == 0.0
        assert intercept == 50.0

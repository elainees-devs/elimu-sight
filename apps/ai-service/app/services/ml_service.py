import math
from typing import Optional
from app.core.config import settings
from app.core.logging import logger


class MLService:
    def __init__(self):
        self._initialized = settings.enable_ml

    @property
    def available(self) -> bool:
        return self._initialized

    def analyze_trend(self, scores: list[float]) -> dict:
        if not scores:
            return {
                "direction": "unknown",
                "slope": 0.0,
                "projected_next": None,
                "volatility": 0.0,
                "consistency": "unknown",
                "risk_trend": "stable",
            }

        n = len(scores)
        if n < 2:
            return {
                "direction": "insufficient_data",
                "slope": 0.0,
                "projected_next": scores[0] if scores else None,
                "volatility": 0.0,
                "consistency": "insufficient_data",
                "risk_trend": "stable",
            }

        x = list(range(n))
        slope, intercept = self._linear_regression(x, scores)

        direction = "improving" if slope > 1 else "declining" if slope < -1 else "stable"
        projected_next = round(intercept + slope * n, 2)

        mean = sum(scores) / n
        variance = sum((s - mean) ** 2 for s in scores) / n
        volatility = round(math.sqrt(variance), 2)

        cv = volatility / mean if mean > 0 else 0
        consistency = "high" if cv < 0.1 else "moderate" if cv < 0.25 else "low"

        risk_trend = self._evaluate_risk_trend(slope, projected_next)

        return {
            "direction": direction,
            "slope": round(slope, 4),
            "projected_next": projected_next,
            "volatility": volatility,
            "consistency": consistency,
            "risk_trend": risk_trend,
        }

    def project_risk(self, scores: list[float]) -> dict:
        trend = self.analyze_trend(scores)
        current_avg = sum(scores) / len(scores) if scores else 0

        projected = trend.get("projected_next")
        if projected is not None:
            projected_risk = (
                "high" if projected < 40 else "moderate" if projected < 55 else "low"
            )
        else:
            projected_risk = "unknown"

        return {
            "current_average": round(current_avg, 2),
            "projected_average": projected,
            "projected_risk": projected_risk,
            "trend": trend["direction"],
            "volatility": trend["volatility"],
            "consistency": trend["consistency"],
            "needs_intervention": projected_risk in ("high", "moderate") if projected is not None else False,
        }

    def _linear_regression(self, x: list[float], y: list[float]) -> tuple[float, float]:
        n = len(x)
        sum_x = sum(x)
        sum_y = sum(y)
        sum_xy = sum(x[i] * y[i] for i in range(n))
        sum_xx = sum(xi * xi for xi in x)

        denominator = n * sum_xx - sum_x * sum_x
        if denominator == 0:
            return 0.0, sum_y / n if n > 0 else 0.0

        slope = (n * sum_xy - sum_x * sum_y) / denominator
        intercept = (sum_y - slope * sum_x) / n
        return slope, intercept

    def _evaluate_risk_trend(self, slope: float, projected: Optional[float]) -> str:
        if projected is None:
            return "stable"
        if slope < -2 and projected < 40:
            return "escalating"
        if slope > 2 and projected > 55:
            return "de-escalating"
        if slope < -1:
            return "worsening"
        if slope > 1:
            return "improving"
        return "stable"


ml_service = MLService()

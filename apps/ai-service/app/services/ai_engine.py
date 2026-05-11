from app.utils.helper import calculate_confidence_score


def analyze_student(student):
    scores = [
        (a.score / a.total_marks) * 100
        for a in student.assessments
        if a.total_marks > 0
    ]

    if not scores:
        return _build_insight_response(
            title="Student Performance Analysis",
            summary=f"{student.full_name} has no assessment data available.",
            data={
                "student_id": student.id,
                "school_id": student.school_id,
                "class_id": student.class_id,
                "average": 0,
                "risk_score": 1.0,
                "flags": ["NO_DATA"],
                "insight": _generate_insight(student.full_name, 0, 1.0, ["NO_DATA"]),
            },
            confidence_score=0.0,
        )

    average = sum(scores) / len(scores)
    flags = _evaluate_flags(average, scores, student)
    risk_score = _calculate_risk_score(average)
    confidence_score = calculate_confidence_score(scores)

    insight = _generate_insight(student.full_name, average, risk_score, flags)

    return _build_insight_response(
        title="Student Performance Analysis",
        summary=f"{student.full_name} is performing at {average:.1f}% average. Risk level: {'high' if risk_score >= 0.7 else 'moderate' if risk_score >= 0.4 else 'low'}.",
        data={
            "student_id": student.id,
            "school_id": student.school_id,
            "class_id": student.class_id,
            "average": round(average, 2),
            "confidence_score": confidence_score,
            "risk_score": risk_score,
            "flags": flags,
            "insight": insight,
            "trend_direction": _calculate_trend(scores),
        },
        confidence_score=confidence_score,
    )


def analyze_class(class_context):
    name = class_context.get("name", "Unknown Class")
    student_count = class_context.get("studentCount", 0)
    subject_count = class_context.get("subjectCount", 0)

    return _build_insight_response(
        title="Class Performance Overview",
        summary=f"Analysis for {name}: {student_count} students across {subject_count} subjects.",
        data={
            "class_id": class_context.get("id"),
            "name": name,
            "level": class_context.get("level"),
            "stream": class_context.get("stream"),
            "studentCount": student_count,
            "subjectCount": subject_count,
        },
        confidence_score=70.0,
    )


def analyze_subject(subject_context):
    name = subject_context.get("name", "Unknown Subject")
    assessments = subject_context.get("assessments", [])

    scores = []
    for a in assessments:
        if a.get("total_marks", 0) > 0:
            scores.append((a.get("score", 0) / a.get("total_marks", 1)) * 100)

    average = sum(scores) / len(scores) if scores else 0
    risk_score = _calculate_risk_score(average) if scores else 1.0

    return _build_insight_response(
        title="Subject Performance Analysis",
        summary=f"Analysis for {name}: {len(scores)} assessments recorded, average {average:.1f}%.",
        data={
            "subject_id": subject_context.get("id"),
            "name": name,
            "code": subject_context.get("code"),
            "average": round(average, 2),
            "risk_score": risk_score,
            "assessment_count": len(scores),
        },
        confidence_score=calculate_confidence_score(scores) if scores else 0.0,
    )


def _build_insight_response(
    title: str,
    summary: str,
    data: dict,
    confidence_score: float,
) -> dict:
    return {
        "title": title,
        "summary": summary,
        "data": data,
        "confidenceScore": round(confidence_score, 2),
    }


def _evaluate_flags(average: float, scores: list[float], student) -> list[str]:
    flags = []
    if average < 40:
        flags.append("HIGH_RISK")
    elif average < 55:
        flags.append("AT_RISK")
    if len(scores) < 3:
        flags.append("LOW_DATA")
    if not student.guardian_phone:
        flags.append("NO_GUARDIAN_CONTACT")
    return flags


def _calculate_risk_score(average: float) -> float:
    if average < 40:
        return 0.9
    elif average < 55:
        return 0.6
    elif average < 75:
        return 0.3
    return 0.1


def _calculate_trend(scores: list[float]) -> str:
    if len(scores) < 2:
        return "insufficient_data"
    recent = scores[-3:] if len(scores) >= 3 else scores
    if len(recent) < 2:
        return "stable"
    if recent[-1] > recent[0]:
        return "improving"
    elif recent[-1] < recent[0]:
        return "declining"
    return "stable"


def _generate_insight(name: str, average: float, risk: float, flags: list[str]) -> dict:
    if risk >= 0.7:
        level = "high risk"
    elif risk >= 0.4:
        level = "moderate risk"
    else:
        level = "low risk"

    return {
        "teacher": (
            f"{name} is at {level}. "
            f"Average performance is {average:.1f}%. "
            f"Immediate intervention recommended."
        ),
        "parent": (
            f"{name} needs academic support at home to improve performance."
        ),
        "student": (
            f"You are currently at {average:.1f}%. "
            f"Keep improving with consistent practice."
        ),
    }

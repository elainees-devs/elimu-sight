## MAIN INTELLIGENCE SERVICE
from app.utils.helper import calculate_confidence_score, format_ai_response


def analyze_student(student):

    # 1. Convert to percentages
    scores = [
        (a.score / a.total_marks) * 100
        for a in student.assessments
        if a.total_marks > 0
    ]

    # 2. Handle no data
    if not scores:
        return format_ai_response(
            {
                "student_id": student.id,
                "school_id": student.school_id,
                "class_id": student.class_id,
                "average": 0,
                "risk_score": 1.0,
                "flags": ["NO_DATA"],
                "insight": generate_insight(student.full_name, 0, 1.0, ["NO_DATA"]),
            }
        )

    # 3. Calculate average
    average = sum(scores) / len(scores)

    # 4. Rules engine
    flags = []

    if average < 40:
        flags.append("HIGH_RISK")

    elif average < 55:
        flags.append("AT_RISK")

    if len(scores) < 3:
        flags.append("LOW_DATA")

    if not student.guardian_phone:
        flags.append("NO_GUARDIAN_CONTACT")

    # 5. Risk scoring
    if average < 40:
        risk_score = 0.9

    elif average < 55:
        risk_score = 0.6

    elif average < 75:
        risk_score = 0.3

    else:
        risk_score = 0.1

    # 6. Confidence score
    confidence_score = calculate_confidence_score(scores)

    # 7. Insight generation
    insight = generate_insight(student.full_name, average, risk_score, flags)

    # 8. Final formatted response
    return format_ai_response(
        {
            "student_id": student.id,
            "school_id": student.school_id,
            "class_id": student.class_id,
            "average": round(average, 2),
            "confidence_score": confidence_score,
            "risk_score": risk_score,
            "flags": flags,
            "insight": insight,
        }
    )


def generate_insight(name, average, risk, flags):

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
            f"{name} needs academic support " f"at home to improve performance."
        ),
        "student": (
            f"You are currently at "
            f"{average:.1f}%. "
            f"Keep improving with consistent practice."
        ),
    }

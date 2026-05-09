## MAIN INTELLIGENCE SERVICE

def analyze_student(student):

    # 1. Convert to percentages
    scores = [
        (a.score / a.total_marks) * 100
        for a in student.assessments
        if a.total_marks > 0
    ]

    if not scores:
        return {
            "average": 0,
            "risk_score": 1.0,
            "flags": ["NO_DATA"],
            "insight": generate_insight(student.full_name, 0, 1.0, ["NO_DATA"])
        }

    average = sum(scores) / len(scores)

    # 2. Rules engine
    flags = []

    if average < 40:
        flags.append("HIGH_RISK")
    elif average < 55:
        flags.append("AT_RISK")

    if len(scores) < 3:
        flags.append("LOW_DATA")

    if not student.guardian_phone:
        flags.append("NO_GUARDIAN_CONTACT")

    # 3. Risk scoring (simple logic)
    if average < 40:
        risk_score = 0.9
    elif average < 55:
        risk_score = 0.6
    elif average < 75:
        risk_score = 0.3
    else:
        risk_score = 0.1

    # 4. Insight generation
    insight = generate_insight(
        student.full_name,
        average,
        risk_score,
        flags
    )

    return {
        "student_id": student.id,
        "school_id": student.school_id,
        "class_id": student.class_id,

        "average": round(average, 2),
        "risk_score": risk_score,
        "flags": flags,
        "insight": insight
    }


def generate_insight(name, average, risk, flags):

    if risk >= 0.7:
        level = "high risk"
    elif risk >= 0.4:
        level = "moderate risk"
    else:
        level = "low risk"

    return {
        "teacher": f"{name} is at {level}. Average performance is {average:.1f}%. Immediate intervention recommended.",
        "parent": f"{name} needs academic support at home to improve performance.",
        "student": f"You are currently at {average:.1f}%. Keep improving with consistent practice."
    }
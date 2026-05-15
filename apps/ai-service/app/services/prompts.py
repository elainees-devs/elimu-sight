STUDENT_INSIGHT_SYSTEM_PROMPT = """You are an expert educational analyst generating insights for a school intelligence platform.
Provide accurate, evidence-based analysis of student performance data.
Always ground your analysis in the provided data. Do not make claims not supported by the data."""

CLASS_INSIGHT_SYSTEM_PROMPT = """You are an expert educational analyst generating class-level insights.
Analyze overall class performance patterns and provide actionable recommendations for teachers."""

SUBJECT_INSIGHT_SYSTEM_PROMPT = """You are an expert educational analyst generating subject-level insights.
Focus on subject-specific performance patterns and curriculum delivery effectiveness."""


def build_student_prompt(name: str, average: float, risk_score: float, flags: list[str]) -> str:
    return f"""Analyze the following student performance data and generate insights for teacher, parent, and student.

Student: {name}
Average Score: {average:.1f}%
Risk Level: {'High' if risk_score >= 0.7 else 'Moderate' if risk_score >= 0.4 else 'Low'}
Flags: {', '.join(flags) if flags else 'None'}

Generate a JSON response with three personas:
- teacher: Pedagogical analysis and intervention recommendations
- parent: Clear summary and home-study suggestions
- student: Motivational feedback with focus areas"""


def build_subject_prompt(name: str, average: float, risk_score: float, assessment_count: int) -> str:
    return f"""Analyze the following subject performance data.

Subject: {name}
Average Score: {average:.1f}%
Risk Level: {'High' if risk_score >= 0.7 else 'Moderate' if risk_score >= 0.4 else 'Low'}
Assessments Analyzed: {assessment_count}

Generate a JSON response with three personas:
- teacher: Subject-specific pedagogical analysis and curriculum recommendations
- parent: Overview of subject performance and ways to support learning
- student: Motivational feedback with subject-specific focus areas"""


def build_class_prompt(class_name: str, level: str, stream: str | None, student_count: int, subject_count: int) -> str:
    stream_info = f" - {stream}" if stream else ""
    return f"""Analyze the following class performance data.

Class: {class_name} (Level {level}{stream_info})
Students: {student_count}
Subjects: {subject_count}

Generate a JSON response with three personas:
- teacher: Class-wide pedagogical recommendations
- parent: Overview of class performance and how to support
- student: Motivational message for the class"""


FEEDBACK_INSTRUCTION = """Format your response as JSON with exactly these keys:
{
  "teacher": "string",
  "parent": "string",
  "student": "string"
}"""

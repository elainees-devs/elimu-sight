export const ROLES = ["SUPER_ADMIN", "ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"] as const;
export const SUBSCRIPTION_PLANS = ["FREE", "BASIC", "PREMIUM"] as const;
export const EXAM_TYPES = ["QUIZ", "CAT", "EXAM", "ASSIGNMENT"] as const;
export const GENDERS = ["Male", "Female"] as const;
export const INSIGHT_TYPES = [
  "STUDENT_PERFORMANCE",
  "CLASS_PERFORMANCE",
  "SUBJECT_TREND",
  "TERM_ANALYSIS",
  "PREDICTION",
  "RECOMMENDATION",
] as const;
export const GENERATED_BY = ["SYSTEM", "AI", "USER"] as const;

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  HEADTEACHER: "Head Teacher",
  TEACHER: "Teacher",
  ACCOUNTANT: "Accountant",
};

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  QUIZ: "Quiz",
  CAT: "CAT",
  EXAM: "Exam",
  ASSIGNMENT: "Assignment",
};

export const APP_NAME = "ElimuSight";

export type Role = (typeof ROLES)[number];
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];
export type ExamType = (typeof EXAM_TYPES)[number];
export type Gender = (typeof GENDERS)[number];
export type InsightType = (typeof INSIGHT_TYPES)[number];
export type GeneratedBy = (typeof GENERATED_BY)[number];

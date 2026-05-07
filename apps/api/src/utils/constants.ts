// Subscription plans
export const subscriptionPlans = ["FREE", "BASIC", "PREMIUM"] as const;

// User roles
export const Roles = ["ADMIN", "TEACHER", "HEADTEACHER", "ACCOUNTANT"] as const;

export const RoleValues = [...Roles];

// Insight types
export const insightTypes = [
  "STUDENT_PERFORMANCE",
  "CLASS_PERFORMANCE",
  "SUBJECT_TREND",
  "TERM_ANALYSIS",
  "PREDICTION",
  "RECOMMENDATION",
] as const;

export const generatedBy = ["SYSTEM", "AI", "USER"] as const;

// Genders
export const genders = ["Male", "Female"] as const;

// Assessment types
export const examTypes = ["QUIZ", "CAT", "EXAM", "ASSIGNMENT"] as const;

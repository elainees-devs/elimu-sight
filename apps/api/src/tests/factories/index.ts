export const UUID_SCHOOL_A = "00000000-0000-0000-0000-000000000001"
export const UUID_SCHOOL_B = "00000000-0000-0000-0000-000000000002"
export const UUID_USER_1 = "00000000-0000-0000-0000-000000000010"
export const UUID_USER_2 = "00000000-0000-0000-0000-000000000011"
export const UUID_CLASS_1 = "00000000-0000-0000-0000-000000000100"
export const UUID_STUDENT_1 = "00000000-0000-0000-0000-000000001000"
export const UUID_SUBJECT_1 = "00000000-0000-0000-0000-000000010000"

const now = new Date()

export function createMockSchool(overrides: Partial<any> = {}) {
  return {
    id: UUID_SCHOOL_A,
    name: "Test School",
    email: "school@test.com",
    phone: "+254700000000",
    address: "123 Test Street",
    subscriptionPlan: "FREE",
    isActive: true,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...overrides,
  }
}

export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: UUID_USER_1,
    full_name: "Test User",
    email: "test@test.com",
    password_hash: "$2b$10$mockhash",
    role: "TEACHER",
    school_id: UUID_SCHOOL_A,
    assigned_class_id: null,
    is_active: true,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function createMockStudent(overrides: Partial<any> = {}) {
  return {
    id: UUID_STUDENT_1,
    full_name: "Test Student",
    admission_number: "ADM001",
    gender: "Male",
    date_of_birth: now,
    school_id: UUID_SCHOOL_A,
    class_id: UUID_CLASS_1,
    is_active: true,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...overrides,
  }
}

export function createMockClass(overrides: Partial<any> = {}) {
  return {
    id: UUID_CLASS_1,
    name: "Grade 1",
    level: "Primary",
    stream: "A",
    academic_year: "2026",
    school_id: UUID_SCHOOL_A,
    class_teacher_id: null,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function createMockSubject(overrides: Partial<any> = {}) {
  return {
    id: UUID_SUBJECT_1,
    name: "Mathematics",
    code: "MATH",
    description: "Mathematics subject",
    school_id: UUID_SCHOOL_A,
    is_active: true,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function createMockAssessment(overrides: Partial<any> = {}) {
  return {
    id: "assessment-1",
    student_id: UUID_STUDENT_1,
    subject_id: UUID_SUBJECT_1,
    school_id: UUID_SCHOOL_A,
    class_id: UUID_CLASS_1,
    score: 75,
    total_marks: 100,
    exam_type: "CAT",
    term: "Term 1",
    grade: "B",
    created_by: UUID_USER_1,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function createMockInsight(overrides: Partial<any> = {}) {
  return {
    id: "insight-1",
    school_id: UUID_SCHOOL_A,
    class_id: UUID_CLASS_1,
    student_id: null,
    subject_id: null,
    title: "Class Performance Analysis",
    summary: "Good progress overall",
    data: { avgScore: 85 },
    type: "CLASS_PERFORMANCE",
    confidence_score: 90,
    generated_by: "AI",
    period: "Term 1 2026",
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...overrides,
  }
}

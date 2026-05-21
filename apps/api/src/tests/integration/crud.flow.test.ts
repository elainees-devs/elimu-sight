import request from "supertest"
import { createMockUser, createMockStudent, createMockClass, createMockSubject, UUID_SCHOOL_A, UUID_USER_1, UUID_CLASS_1, UUID_STUDENT_1, UUID_SUBJECT_1 } from "../factories"

const mockPrisma = {
  users: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  schools: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
  classes: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  students: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  subjects: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  assessments: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  class_subjects: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), count: jest.fn(), update: jest.fn(), findFirst: jest.fn() },
  teachers: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), create: jest.fn() },
  insights: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
  refresh_tokens: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  audit_logs: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  announcements: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), findUnique: jest.fn() },
  support_tickets: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn(), findUnique: jest.fn() },
  $disconnect: jest.fn(),
}

jest.mock("@utils/prisma", () => ({ prisma: mockPrisma }))

jest.mock("@config/env", () => ({
  env: {
    NODE_ENV: "test", PORT: 5000,
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    JWT_SECRET: "test-jwt-secret",
    JWT_EXPIRES_IN: "1h", REFRESH_TOKEN_EXPIRES_IN: "7d",
    AI_SERVICE_URL: "http://localhost:8000", AI_SERVICE_API_KEY: "",
    SENTRY_DSN: "", REDIS_URL: "",
    CLIENT_URL: "http://localhost:5173",
    isDevelopment: false, isProduction: false, isTest: true,
  },
}))

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
}))

jest.mock("../../utils/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("mock-jwt-token"),
  verifyToken: jest.fn(),
}))

jest.mock("../../utils/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}))

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}))

jest.mock("../../utils/audit", () => ({
  logAudit: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../../utils/analytics", () => ({
  createAnalyticsEvent: jest.fn(),
}))

import app from "../../app"

beforeEach(() => {
  const jwt = require("jsonwebtoken")
  jwt.verify.mockReturnValue({
    id: UUID_USER_1,
    email: "admin@school-a.com",
    name: "Admin",
    role: "ADMIN",
    schoolId: UUID_SCHOOL_A,
  })
})

describe("Student CRUD", () => {
  const createStudentPayload = {
    fullName: "Jane Doe",
    admissionNumber: "ADM002",
    gender: "Female",
    dateOfBirth: "2011-05-15",
    schoolId: UUID_SCHOOL_A,
    classId: UUID_CLASS_1,
  }

  it("creates a student", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser({ school_id: UUID_SCHOOL_A, role: "ADMIN" }))
    mockPrisma.students.findFirst.mockResolvedValue(null)
    mockPrisma.students.create.mockResolvedValue(createMockStudent({ full_name: "Jane Doe" }))
    mockPrisma.classes.findUnique.mockResolvedValue(createMockClass())

    const res = await request(app)
      .post("/api/v1/students")
      .set("Authorization", "Bearer mock-jwt-token")
      .send(createStudentPayload)
      .expect(201)

    expect(res.body.success).toBe(true)
  })

  it("lists students by school", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser({ school_id: UUID_SCHOOL_A, role: "ADMIN" }))
    mockPrisma.students.findMany.mockResolvedValue([createMockStudent()])
    mockPrisma.students.count.mockResolvedValue(1)

    const res = await request(app)
      .get("/api/v1/students")
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(1)
  })

  it("rejects creation with missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/students")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({ schoolId: UUID_SCHOOL_A })
      .expect(400)
  })
})

describe("Class CRUD", () => {
  it("creates a class", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser({ school_id: UUID_SCHOOL_A, role: "ADMIN" }))
    mockPrisma.classes.findFirst.mockResolvedValue(null)
    mockPrisma.classes.create.mockResolvedValue(createMockClass())

    const res = await request(app)
      .post("/api/v1/classes")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({ name: "Grade 2", level: "Primary", stream: "A", academicYear: "2026", schoolId: UUID_SCHOOL_A })
      .expect(201)

    expect(res.body.success).toBe(true)
  })

  it("fetches class by id", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser({ school_id: UUID_SCHOOL_A, role: "TEACHER" }))
    mockPrisma.classes.findUnique.mockResolvedValue(createMockClass())

    const res = await request(app)
      .get(`/api/v1/classes/${UUID_CLASS_1}`)
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(200)

    expect(res.body.success).toBe(true)
  })
})

describe("Subject CRUD", () => {
  it("creates a subject", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser({ school_id: UUID_SCHOOL_A, role: "ADMIN" }))
    mockPrisma.subjects.create.mockResolvedValue(createMockSubject())

    const res = await request(app)
      .post("/api/v1/subjects")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({ name: "Science", code: "SCI", schoolId: UUID_SCHOOL_A })
      .expect(201)

    expect(res.body.success).toBe(true)
  })

  it("returns 403 when schoolId missing (validateSchoolAccess blocks)", async () => {
    const res = await request(app)
      .post("/api/v1/subjects")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({ name: "Science" })
      .expect(403)

    expect(res.body.message).toMatch(/do not have access/i)
  })
})

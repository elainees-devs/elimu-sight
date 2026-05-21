import request from "supertest"
import { createMockUser, UUID_SCHOOL_A, UUID_SCHOOL_B, UUID_USER_1 } from "../factories"

const mockPrisma = {
  users: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn() },
  schools: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  classes: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
  students: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
  subjects: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  assessments: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), aggregate: jest.fn(), count: jest.fn() },
  class_subjects: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  teachers: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  insights: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  refresh_tokens: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  audit_logs: { create: jest.fn() },
  dashboard: { stats: jest.fn() },
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
    email: "teacher@school-a.com",
    name: "Teacher A",
    role: "TEACHER",
    schoolId: UUID_SCHOOL_A,
  })
})

describe("Tenant Isolation — assessments (has validateSchoolAccess)", () => {
  it("allows access to own school's assessments", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(
      createMockUser({ id: UUID_USER_1, school_id: UUID_SCHOOL_A, role: "TEACHER" })
    )
    mockPrisma.assessments.findMany.mockResolvedValue([])

    const res = await request(app)
      .get(`/api/v1/assessments/school/${UUID_SCHOOL_A}`)
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(200)

    expect(res.body.success).toBe(true)
  })

  it("blocks access to other school's assessments", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(
      createMockUser({ id: UUID_USER_1, school_id: UUID_SCHOOL_A, role: "TEACHER" })
    )

    const res = await request(app)
      .get(`/api/v1/assessments/school/${UUID_SCHOOL_B}`)
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(403)

    expect(res.body.message).toMatch(/do not have access/i)
  })

  it("allows SUPER_ADMIN to access any school", async () => {
    const jwt = require("jsonwebtoken")
    jwt.verify.mockReturnValue({
      id: "admin-1", email: "admin@system.com", name: "Super Admin",
      role: "SUPER_ADMIN", schoolId: undefined,
    })
    mockPrisma.users.findUnique.mockResolvedValue(
      createMockUser({ id: "admin-1", school_id: null, role: "SUPER_ADMIN" })
    )
    mockPrisma.assessments.findMany.mockResolvedValue([])

    const res = await request(app)
      .get(`/api/v1/assessments/school/${UUID_SCHOOL_B}`)
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(200)

    expect(res.body.success).toBe(true)
  })
})

import request from "supertest"
import { createMockUser, UUID_SCHOOL_A, UUID_USER_1 } from "../factories"

const SCHOOL_UUID = UUID_SCHOOL_A
const USER_UUID = UUID_USER_1

const mockPrisma = {
  users: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn() },
  schools: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  refresh_tokens: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  teachers: { create: jest.fn() },
  audit_logs: { create: jest.fn() },
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

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn().mockResolvedValue("hash"),
  comparePassword: jest.fn().mockResolvedValue(true),
}))

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn().mockReturnValue({
    id: USER_UUID, email: "teacher@school.com", name: "Teacher",
    role: "TEACHER", schoolId: SCHOOL_UUID,
  }),
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
}))

jest.mock("../../utils/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("mock-jwt-token"),
  verifyToken: jest.fn(),
}))

jest.mock("../../utils/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}))

jest.mock("../../utils/audit", () => ({
  logAudit: jest.fn().mockResolvedValue(undefined),
}))

import app from "../../app"

const mockUser = createMockUser({ id: USER_UUID, school_id: SCHOOL_UUID })

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    mockPrisma.users.findUnique.mockResolvedValue(null)
    mockPrisma.users.create.mockResolvedValue(mockUser)
    mockPrisma.refresh_tokens.create.mockResolvedValue({ token: "mock-refresh-token" } as any)
  })

  const validPayload = {
    fullName: "New Teacher",
    email: "teacher@school.com",
    password: "password123",
    schoolId: SCHOOL_UUID,
    role: "TEACHER",
  }

  it("registers a new user successfully", async () => {
    mockPrisma.users.create.mockResolvedValue(
      createMockUser({ id: USER_UUID, school_id: SCHOOL_UUID, email: "teacher@school.com" })
    )

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload)
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe("teacher@school.com")
  })

  it("rejects duplicate email", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser())

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload)
      .expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/already in use/i)
  })

  it("rejects registration without schoolId for non-SUPER_ADMIN", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validPayload, schoolId: undefined })
      .expect(400)

    expect(res.body.success).toBe(false)
  })

  it("accepts SUPER_ADMIN without schoolId", async () => {
    mockPrisma.users.create.mockResolvedValue(
      createMockUser({ role: "SUPER_ADMIN", school_id: null })
    )

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Super Admin",
        email: "admin@system.com",
        password: "password123",
        role: "SUPER_ADMIN",
      })
      .expect(201)

    expect(res.body.success).toBe(true)
  })

  it("rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validPayload, email: "not-an-email" })
      .expect(400)

    expect(res.body.success).toBe(false)
  })

  it("rejects short password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validPayload, password: "123" })
      .expect(400)

    expect(res.body.success).toBe(false)
  })
})

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    mockPrisma.users.findUnique.mockResolvedValue(null)
    mockPrisma.users.create.mockResolvedValue(mockUser)
    mockPrisma.refresh_tokens.create.mockResolvedValue({ token: "mock-refresh-token" } as any)
  })

  it("logs in with valid credentials", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(
      createMockUser({ id: USER_UUID, school_id: SCHOOL_UUID })
    )

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "teacher@school.com", password: "password123" })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBe("mock-jwt-token")
    expect(res.body.data.refreshToken).toBeDefined()
  })

  it("rejects invalid password", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(createMockUser())
    require("../../utils/hash").comparePassword.mockResolvedValue(false)

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "wrongpassword" })
      .expect(401)

    expect(res.body.success).toBe(false)
  })

  it("rejects non-existent user", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(null)

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@test.com", password: "password123" })
      .expect(401)

    expect(res.body.success).toBe(false)
  })
})

describe("GET /api/v1/auth/me", () => {
  beforeEach(() => {
    mockPrisma.users.findUnique.mockResolvedValue(null)
    mockPrisma.users.create.mockResolvedValue(mockUser)
    mockPrisma.refresh_tokens.create.mockResolvedValue({ token: "mock-refresh-token" } as any)
  })

  it("returns current user when authenticated", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(
      createMockUser({ id: USER_UUID })
    )

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer mock-jwt-token")
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe("test@test.com")
  })

  it("returns 401 without auth header", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .expect(401)

    expect(res.body.message).toBe("Authentication token required")
  })
})

import { Response } from "express";
import { AuthRequest } from "../../types/express";

export function createMockReq(overrides: Partial<AuthRequest> = {}): AuthRequest {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: { id: "test-user", name: "Test", email: "test@test.com", role: "ADMIN", schoolId: "school-1" },
    ...overrides,
  } as unknown as AuthRequest;
}

export function createMockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

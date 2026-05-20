import crypto from "crypto";

import {
  ApiError,
  comparePassword,
  hashPassword,
  prisma,
  generateToken,
  Roles,
  env,
  logger,
} from "@utils/index";

import { CreateUserInput } from "schemas";
import { toUserResponse, UserDB } from "mappers/user.mapper";

export class AuthService {
  // =========================
  // REGISTER USER
  // =========================
  async registerUser(input: CreateUserInput) {
    const existingUser = await prisma.users.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ApiError(400, "Email already in use");
    }

    if (input.role !== "SUPER_ADMIN" && !input.schoolId) {
      throw new ApiError(400, "School ID is required for this role");
    }

    if (input.role === "HEADTEACHER") {
      const existingHeadteacher = await prisma.users.findFirst({
        where: { school_id: input.schoolId!, role: "HEADTEACHER", is_active: true },
      });
      if (existingHeadteacher) {
        throw new ApiError(400, "This school already has a HEADTEACHER");
      }
    }

    const passwordHash = await hashPassword(input.password);

    try {
      const newUser = await prisma.users.create({
        data: {
          full_name: input.fullName,
          email: input.email,
          password_hash: passwordHash,
          role: input.role,
          school_id: input.role === "SUPER_ADMIN" ? null : input.schoolId!,
          is_active: true,
        },
      });

      return toUserResponse(newUser as UserDB);
    } catch (error: unknown) {
      if ((error as { code?: string })?.code === "P2002") {
        throw new ApiError(400, "Email already exists");
      }

      logger.error("Failed to create user", { error: error instanceof Error ? error.message : String(error) });
      throw new ApiError(500, "Failed to create user");
    }
  }

  // =========================
  // LOGIN USER
  // =========================
  async loginUser(email: string, password: string) {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const role = user.role;

    if (!role || !Roles.includes(role as (typeof Roles)[number])) {
      throw new ApiError(500, "Invalid user role");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: role as (typeof Roles)[number],
      schoolId: user.school_id ?? undefined,
    });

    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      token,
      refreshToken,
      user: toUserResponse(user as UserDB),
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  async refreshAccessToken(refreshTokenStr: string) {
    const stored = await prisma.refresh_tokens.findUnique({
      where: { token: refreshTokenStr },
      include: { users: true },
    });

    if (!stored || stored.revoked_at) {
      throw new ApiError(401, "Invalid or revoked refresh token");
    }

    if (stored.expires_at < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    // Rotate: revoke old token, issue new one
    await prisma.refresh_tokens.update({
      where: { id: stored.id },
      data: { revoked_at: new Date() },
    });

    const user = stored.users;
    const role = user.role;

    const newAccessToken = generateToken({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: role as (typeof Roles)[number],
      schoolId: user.school_id ?? undefined,
    });

    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // =========================
  // LOGOUT (revoke all user tokens)
  // =========================
  async logoutUser(userId: string) {
    await prisma.refresh_tokens.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  // =========================
  // GENERATE REFRESH TOKEN
  // =========================
  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString("hex");

    const expiresInMs = this.parseDuration(env.REFRESH_TOKEN_EXPIRES_IN);

    await prisma.refresh_tokens.create({
      data: {
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + expiresInMs),
      },
    });

    return token;
  }

  // =========================
  // PARSE DURATION STRING
  // =========================
  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000; // default 30 days

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "d": return value * 24 * 60 * 60 * 1000;
      case "h": return value * 60 * 60 * 1000;
      case "m": return value * 60 * 1000;
      case "s": return value * 1000;
      default: return 30 * 24 * 60 * 60 * 1000;
    }
  }

  // =========================
  // GET CURRENT USER
  // =========================
  async getCurrentUser(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toUserResponse(user as UserDB);
  }
}

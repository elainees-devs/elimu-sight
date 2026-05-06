import {
  ApiError,
  comparePassword,
  hashPassword,
  prisma,
  generateToken,
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

    const passwordHash = await hashPassword(input.password);

    try {
      const newUser = await prisma.users.create({
        data: {
          full_name: input.fullName,
          email: input.email,
          password_hash: passwordHash,
          role: input.role,
          school_id: input.schoolId,
          is_active: true,
        },
      });

      return toUserResponse(newUser as UserDB);
    } catch (error: any) {
      if (error?.code === "P2002") {
        throw new ApiError(400, "Email already exists");
      }

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

    const token = generateToken({
      id: user.id,
      email: user.email,
      roles: user.role,
    });

    return {
      token,
      user: toUserResponse(user as UserDB),
    };
  }

  // =========================
  // VALIDATE SCHOOL ACCESS
  // =========================
  async validateSchoolAccess(
    userId: string,
    schoolId: string
  ): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user.role === "ADMIN" || user.school_id === schoolId;
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
import {
  ApiError,
  comparePassword,
  hashPassword,
  prisma,
  generateToken,
} from "@utils/index";
import { CreateUserInput } from "schemas";



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
        select: {
          id: true,
          full_name: true,
          email: true,
          role: true,
          school_id: true,
          is_active: true,
        },
      });

      return newUser;
    } catch (error) {
    
      if (error instanceof prisma.PrismaClientKnownRequestError) {
        if (error === "P2002") {
          throw new ApiError(400, "Email already exists");
        }
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
      roles: [user.role],
    });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        roles: [user.role],
        school_id: user.school_id,
      },
    };
  }

  // =========================
  // VALIDATE SCHOOL ACCESS
  // =========================
  async validateSchoolAccess(userId: number, schoolId: number): Promise<boolean> {
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
  async getCurrentUser(userId: number) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        roles: true,
        school_id: true,
        is_active: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}
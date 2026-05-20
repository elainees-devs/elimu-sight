import { Prisma } from "@prisma/client";
import { ApiError, prisma, logger } from "@utils/index";
import {
  toUserId,
  toUserListResponse,
  toUserResponse,
  toUpdateUserDB,
  UserDB,
} from "mappers/user.mapper";
import { UpdateUserInput, UserIdParam } from "schemas/user.schema";

type GetUserParams = {
  page?: number;
  limit?: number;
  sortBy?: "full_name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class UserService {
  // ===================================
  // GET ALL USERS
  // ===================================
  async getAllUsersBySchool(schoolId: string, params: GetUserParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      const where: Prisma.usersWhereInput = {
        school_id: schoolId,
        is_active: true,
      };

      if (search) {
        where.OR = [
          { full_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.users.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),

        prisma.users.count({ where }),
      ]);

      return {
        data: toUserListResponse(users as UserDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch users");
      throw new ApiError(500, "Failed to fetch users");
    }
  }

  // ===================================
  // GET USER BY ID
  // ===================================
  async getUserById(params: UserIdParam) {
    try {
      const id = toUserId(params);

      const user = await prisma.users.findFirst({
        where: {
          id,
          is_active: true,
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return toUserResponse(user as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch user", { error });
      throw new ApiError(500, "Failed to fetch user");
    }
  }

  // ===================================
  // GET USER BY EMAIL (scoped to school)
  // ===================================
  async getUserByEmail(email: string, schoolId?: string) {
    try {
      const where: Prisma.usersWhereInput = {
        email,
        is_active: true,
      };

      if (schoolId) {
        where.school_id = schoolId;
      }

      const user = await prisma.users.findFirst({ where });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return toUserResponse(user as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch user by email", { error });
      throw new ApiError(500, "Failed to fetch user by email");
    }
  }

  // ===================================
  // UPDATE USER
  // ===================================
  async updateUserDetails(input: UpdateUserInput) {
    try {
      const { id, ...updateData } = input;

      const existing = await prisma.users.findFirst({
        where: {
          id,
          is_active: true,
        },
      });

      if (!existing) {
        throw new ApiError(404, "User not found");
      }

      if (updateData.role === "SUPER_ADMIN") {
        throw new ApiError(403, "Cannot promote user to SUPER_ADMIN");
      }

      const dbUpdate = toUpdateUserDB(updateData);

      const updated = await prisma.users.update({
        where: { id },
        data: dbUpdate,
      });

      return toUserResponse(updated as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update user", { error });
      throw new ApiError(500, "Failed to update user");
    }
  }

  // ===================================
  // SOFT DELETE USER
  // ===================================
  async deleteUser(params: UserIdParam) {
    try {
      const id = toUserId(params);

      const existing = await prisma.users.findFirst({
        where: {
          id,
          is_active: true,
        },
      });

      if (!existing) {
        throw new ApiError(404, "User not found");
      }

      const deleted = await prisma.users.update({
        where: { id },
        data: {
          is_active: false,
          updated_at: new Date(),
        },
      });

      return toUserResponse(deleted as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete user", { error });
      throw new ApiError(500, "Failed to delete user");
    }
  }

  // ===================================
  // COUNT USERS
  // ===================================
  async getUserCount() {
    try {
      return prisma.users.count({
        where: {
          is_active: true,
        },
      });
    } catch {
      logger.error("Failed to get user count");
      throw new ApiError(500, "Failed to get user count");
    }
  }
}
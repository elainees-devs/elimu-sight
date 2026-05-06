import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { toUpdateUserDB, toUserListResponse, toUserResponse } from "mappers/user.mapper";
import { UpdateUserInput } from "schemas/user.schema";

type GetUserParams = {
  page?: number;
  limit?: number;
  sortBy?: "full_name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class UserService {
  // =========================
  // GET ALL USERS BY SCHOOL LOGIC
  // =========================
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

      // =========================
      // FILTER
      // =========================
      const where: any = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { full_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
        ];
      }

      // =========================
      // QUERY
      // =========================
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
        data: toUserListResponse(users),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch users");
    }
  }

  // ============================
  // GET A USER BY  EMAIL LOGIC
  // ============================
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return toUserResponse(user);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch user by email");
    }
}

// ===========================
// UPDATE USER DETAILS LOGIC
// ===========================
async updateUserDetails(input: UpdateUserInput) {
    try {
      const { id, ...updateData } = input;
      // Check if user exists
      const existingUser = await prisma.users.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new ApiError(404, "User not found");
      }
      const updatedUser = await prisma.users.update({
        where: { id },
        data: {
          ...toUpdateUserDB(updateData),
        },
      });

      return toUserResponse(updatedUser);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update user details");
    }
  }

}


// =========================
// DELETE ALL USERS LOGIC
// =========================

// ================================
// SOFT DELETE A USER BY  EMAIL LOGIC
// =================================

// =========================
// COUNT ALL USERS BY  EMAIL LOGIC
// =========================

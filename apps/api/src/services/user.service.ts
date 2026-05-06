import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { toUserListResponse } from "mappers/user.mapper";

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

  // ==========================
  // GET A USER BY  EMAIL LOGIC
  // ==========================
}

// =========================
// UPDATE USER DETAILS LOGIC
// =========================

// =========================
// DELETE ALL USERS LOGIC
// =========================

// ================================
// SOFT DELETE A USER BY  EMAIL LOGIC
// =================================

// =========================
// COUNT ALL USERS BY  EMAIL LOGIC
// =========================

import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { toSchoolListResponse } from "mappers/school.mapper";

type GetSchoolsParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const SchoolService = {
  // =========================
  // GET ALL SCHOOLS
  // =========================
  async getAllSchools(params: GetSchoolsParams) {
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
      // FILTERING
      // =========================
      const where: any = {
        deleted_at: null,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [schools, total] = await Promise.all([
        prisma.schools.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),
        prisma.schools.count({ where }),
      ]);

      return {
        data: toSchoolListResponse(schools),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch schools");
    }
  },
  // =========================
  // GET SCHOOL BY EMAIL
  // =========================
  async getSchoolByEmail(email: string) {
    try {
      const school = await prisma.schools.findFirst({
        where: {
          email,
          deleted_at: null,
        },
      });

      if (!school) {
        throw new ApiError(404, "School not found");
      }

      return school;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch school by email");
    }
  }
  // =========================

};
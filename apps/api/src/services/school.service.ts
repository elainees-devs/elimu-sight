import { Prisma } from "@prisma/client";
import { ApiError, prisma, logger } from "@utils/index";
import {
  SchoolDB,
  toSchoolId,
  toSchoolListResponse,
  toSchoolResponse,
  toCreateSchoolDB,
  toUpdateSchoolDB,
} from "mappers/school.mapper";
import {
  SchoolIdParam,
  CreateSchoolInput,
  UpdateSchoolInput,
} from "schemas/school.schema";

type GetSchoolParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class SchoolService {
  // ===================================
  // GET ALL SCHOOLS
  // ===================================
  async getAllSchools(params: GetSchoolParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      const where: Prisma.schoolsWhereInput = {
        deleted_at: null,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

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
        data: toSchoolListResponse(schools as SchoolDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch schools");
      throw new ApiError(500, "Failed to fetch schools");
    }
  }

  // ===================================
  // GET SCHOOL BY ID
  // ===================================
  async getSchoolById(params: SchoolIdParam) {
    try {
      const id = toSchoolId(params);

      const school = await prisma.schools.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!school) {
        throw new ApiError(404, "School not found");
      }

      return toSchoolResponse(school as SchoolDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch school", { error });
      throw new ApiError(500, "Failed to fetch school");
    }
  }

  // ===================================
  // GET SCHOOL BY EMAIL
  // ===================================
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

      return toSchoolResponse(school as SchoolDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch school by email", { error });
      throw new ApiError(500, "Failed to fetch school by email");
    }
  }

  // ===================================
  // CREATE SCHOOL
  // ===================================
  async createSchool(input: CreateSchoolInput) {
    try {
      const { email } = input;

      const existing = await prisma.schools.findFirst({
        where: {
          email,
          deleted_at: null,
        },
      });

      if (existing) {
        throw new ApiError(400, "Email already in use");
      }

      const dbData = toCreateSchoolDB(input);

      const created = await prisma.schools.create({
        data: dbData,
      });

      return toSchoolResponse(created as SchoolDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to create school", { error });
      throw new ApiError(500, "Failed to create school");
    }
  }

  // ===================================
  // UPDATE SCHOOL
  // ===================================
  async updateSchool(input: UpdateSchoolInput) {
    try {
      const { id, email } = input;

      const existing = await prisma.schools.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!existing) {
        throw new ApiError(404, "School not found");
      }

      if (email && email !== existing.email) {
        const emailTaken = await prisma.schools.findFirst({
          where: {
            email,
            deleted_at: null,
            NOT: { id },
          },
        });

        if (emailTaken) {
          throw new ApiError(400, "Email already in use");
        }
      }

      const dbUpdate = toUpdateSchoolDB(input);

      const updated = await prisma.schools.update({
        where: { id },
        data: dbUpdate,
      });

      return toSchoolResponse(updated as SchoolDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update school", { error });
      throw new ApiError(500, "Failed to update school");
    }
  }

  // ===================================
  // DELETE SCHOOL (SOFT DELETE)
  // ===================================
  async deleteSchool(params: SchoolIdParam) {
    try {
      const id = toSchoolId(params);

      const existing = await prisma.schools.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!existing) {
        throw new ApiError(404, "School not found");
      }

      const deleted = await prisma.schools.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });

      return toSchoolResponse(deleted as SchoolDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete school", { error });
      throw new ApiError(500, "Failed to delete school");
    }
  }

  // ===================================
  // COUNT SCHOOLS
  // ===================================
  async getSchoolCount() {
    try {
      return prisma.schools.count({
        where: {
          deleted_at: null,
        },
      });
    } catch {
      logger.error("Failed to get school count");
      throw new ApiError(500, "Failed to get school count");
    }
  }
}
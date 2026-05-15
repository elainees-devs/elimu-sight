import { Prisma } from "@prisma/client";
import { ApiError, prisma, logger } from "@utils/index";
import {
  ClassDB,
  toClassId,
  toClassListResponse,
  toClassResponse,
  toCreateClassDB,
  toUpdateClassDB,
} from "mappers/class.mapper";
import {
  ClassIdParam,
  CreateClassInput,
  UpdateClassInput,
} from "schemas/class.schema";

type GetClassParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class ClassService {
  // ===================================
  // GET ALL CLASSES
  // ===================================
  async getAllClasses(schoolId: string, params: GetClassParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      const where: Prisma.classesWhereInput = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { level: { contains: search, mode: "insensitive" } },
          { stream: { contains: search, mode: "insensitive" } },
          { academic_year: { contains: search, mode: "insensitive" } },
        ];
      }

      const [classes, total] = await Promise.all([
        prisma.classes.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),

        prisma.classes.count({ where }),
      ]);

      return {
        data: toClassListResponse(classes as ClassDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch classes");
      throw new ApiError(500, "Failed to fetch classes");
    }
  }

  // ===================================
  // GET CLASS BY ID
  // ===================================
  async getClassById(params: ClassIdParam) {
    try {
      const id = toClassId(params);

      const classData = await prisma.classes.findUnique({
        where: { id },
      });

      if (!classData) {
        throw new ApiError(404, "Class not found");
      }

      return toClassResponse(classData as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch class", { error });
      throw new ApiError(500, "Failed to fetch class");
    }
  }

  // ===================================
  // CREATE CLASS
  // ===================================
  async createClass(input: CreateClassInput) {
    try {
      const { schoolId, name, level, stream, academicYear } = input;

      const existingClass = await prisma.classes.findFirst({
        where: {
          school_id: schoolId,
          name,
          level,
          stream,
          academic_year: academicYear,
        },
      });

      if (existingClass) {
        throw new ApiError(400, "Class already exists");
      }

      const dbData = toCreateClassDB(input);

      const created = await prisma.classes.create({
        data: dbData,
      });

      return toClassResponse(created as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to create class", { error });
      throw new ApiError(500, "Failed to create class");
    }
  }

  // ===================================
  // UPDATE CLASS
  // ===================================
  async updateClassDetails(input: UpdateClassInput) {
    try {
      const { id, ...updateData } = input;

      const existingClass = await prisma.classes.findUnique({
        where: { id },
      });

      if (!existingClass) {
        throw new ApiError(404, "Class not found");
      }

      const dbUpdate = toUpdateClassDB(updateData);

      const updated = await prisma.classes.update({
        where: { id },
        data: dbUpdate,
      });

      return toClassResponse(updated as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update class", { error });
      throw new ApiError(500, "Failed to update class");
    }
  }

  // ===================================
  // DELETE CLASS (HARD DELETE FIXED)
  // ===================================
  async deleteClass(params: ClassIdParam) {
    try {
      const id = toClassId(params);

      const existing = await prisma.classes.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Class not found");
      }

      const deleted = await prisma.classes.delete({
        where: { id },
      });

      return toClassResponse(deleted as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete class", { error });
      throw new ApiError(500, "Failed to delete class");
    }
  }

  // ===================================
  // COUNT CLASSES
  // ===================================
  async getClassCount(schoolId: string) {
    try {
      return prisma.classes.count({
        where: {
          school_id: schoolId,
        },
      });
    } catch {
      logger.error("Failed to get class count");
      throw new ApiError(500, "Failed to get class count");
    }
  }
}
import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { ClassDB, toClassId, toClassListResponse, toClassResponse } from "mappers/class.mapper";
import { ClassIdParam } from "schemas/class.schema";

type GetClassParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class ClassService {
  // ===============================
  // GET ALL CLASSES LOGIC
  // ===============================
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

      // =========================
      // FILTER
      // =========================
      const where: any = {
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

      // =========================
      // QUERY
      // =========================
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
        data: toClassListResponse(classes),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch classes");
    }
  }

  // ===============================
  // GET CLASSES BY ID LOGIC
  // ===============================
  async getClassById(params: ClassIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toClassId(params);

      // =========================
      // FETCH CLASS
      // =========================
      const classData = await prisma.classes.findUnique({
        where: { id },
      });

      // =========================
      // NOT FOUND CHECK
      // =========================
      if (!classData) {
        throw new ApiError(404, "Class not found");
      }

      // =========================
      // MAP TO RESPONSE
      // =========================
      return toClassResponse(classData as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch class");
    }
  }


  // ===============================
  // CREATE NEW CLASS LOGIC
  // ===============================

  // ===============================
  // UPDATE  CLASS DETAILS LOGIC
  // ===============================

  // ===============================
  // SOFT DELETE CLASS LOGIC
  // ===============================

  // ===============================
  // COUNT ALL CLASSES LOGIC
  // ===============================

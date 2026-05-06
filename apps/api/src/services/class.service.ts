import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { ClassDB, toClassId, toClassListResponse, toClassResponse, toCreateClassDB, toUpdateClassDB } from "mappers/class.mapper";
import { ClassIdParam, CreateClassInput, UpdateClassInput } from "schemas/class.schema";

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
  async createClass(input: CreateClassInput) {
    try {
      const { schoolId, name, level, stream, academicYear } = input;

      // =========================
      // OPTIONAL: DUPLICATE CHECK
      // =========================
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

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toCreateClassDB(input);

      // =========================
      // CREATE CLASS
      // =========================
      const newClass = await prisma.classes.create({
        data: dbData,
      });

      // =========================
      // MAP DB → RESPONSE
      // =========================
      return toClassResponse(newClass as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to create class");
    }
  }


// ===============================
  // UPDATE CLASS DETAILS LOGIC
  // ===============================
  async updateClassDetails(input: UpdateClassInput) {
    try {
      const { id, ...updateData } = input;

      // =========================
      // CHECK IF CLASS EXISTS
      // =========================
      const existingClass = await prisma.classes.findUnique({
        where: { id },
      });

      if (!existingClass) {
        throw new ApiError(404, "Class not found");
      }

      // =========================
      // OPTIONAL: DUPLICATE CHECK (if name/level changes)
      // =========================
      const dbUpdate = toUpdateClassDB(updateData);

      if (
        updateData.name ||
        updateData.level ||
        updateData.stream ||
        updateData.academicYear
      ) {
        const duplicate = await prisma.classes.findFirst({
          where: {
            school_id: existingClass.school_id,
            name: updateData.name ?? existingClass.name,
            level: updateData.level ?? existingClass.level,
            stream: updateData.stream ?? existingClass.stream,
            academic_year:
              updateData.academicYear ?? existingClass.academic_year,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ApiError(400, "Another class with same details exists");
        }
      }

      // =========================
      // UPDATE CLASS
      // =========================
      const updatedClass = await prisma.classes.update({
        where: { id },
        data: dbUpdate,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassResponse(updatedClass as ClassDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update class");
    }
  }
}


  // ===============================
  // SOFT DELETE CLASS LOGIC
  // ===============================

  // ===============================
  // COUNT ALL CLASSES LOGIC
  // ===============================

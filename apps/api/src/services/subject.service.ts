import { ApiError, prisma, logger } from "@utils/index";
import {
  SubjectDB,
  toSubjectListResponse,
  toSubjectResponse,
  toCreateSubjectDB,
  toUpdateSubjectDB,
  toSubjectId,
} from "mappers/subject.mapper";
import {
  CreateSubjectInput,
  SubjectIdParam,
  UpdateSubjectInput,
} from "schemas/subject.schema";

type GetSubjectParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class SubjectService {
  // ===================================
  // GET ALL SUBJECTS
  // ===================================
  async getAllSubjects(schoolId: string, params: GetSubjectParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      const where: any = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [subjects, total] = await Promise.all([
        prisma.subjects.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),

        prisma.subjects.count({ where }),
      ]);

      return {
        data: toSubjectListResponse(subjects as SubjectDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch subjects");
      throw new ApiError(500, "Failed to fetch subjects");
    }
  }

  // ===================================
  // GET SUBJECT BY ID
  // ===================================
  async getSubjectById(params: SubjectIdParam) {
    try {
      const id = toSubjectId(params);

      const subject = await prisma.subjects.findUnique({
        where: { id },
      });

      if (!subject) {
        throw new ApiError(404, "Subject not found");
      }

      return toSubjectResponse(subject as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch subject", { error });
      throw new ApiError(500, "Failed to fetch subject");
    }
  }

  // ===================================
  // GET SUBJECT BY NAME
  // ===================================
  async getSubjectByName(schoolId: string, name: string) {
    try {
      const subject = await prisma.subjects.findFirst({
        where: {
          school_id: schoolId,
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

      if (!subject) {
        throw new ApiError(404, "Subject not found");
      }

      return toSubjectResponse(subject as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch subject by name", { error });
      throw new ApiError(500, "Failed to fetch subject by name");
    }
  }

  // ===================================
  // CREATE SUBJECT
  // ===================================
  async createSubject(input: CreateSubjectInput) {
    try {
      const { schoolId, name } = input;

      const existing = await prisma.subjects.findFirst({
        where: {
          school_id: schoolId,
          name: { equals: name, mode: "insensitive" },
        },
      });

      if (existing) {
        throw new ApiError(400, "Subject already exists");
      }

      const dbData = toCreateSubjectDB(input);

      const created = await prisma.subjects.create({
        data: dbData,
      });

      return toSubjectResponse(created as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to create subject", { error });
      throw new ApiError(500, "Failed to create subject");
    }
  }

  // ===================================
  // UPDATE SUBJECT
  // ===================================
  async updateSubjectDetails(input: UpdateSubjectInput) {
    try {
      const { id, ...updateData } = input;

      const existing = await prisma.subjects.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Subject not found");
      }

      if (updateData.name) {
        const duplicate = await prisma.subjects.findFirst({
          where: {
            school_id: existing.school_id,
            name: updateData.name,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ApiError(400, "Subject name already exists");
        }
      }

      const dbUpdate = toUpdateSubjectDB(updateData);

      const updated = await prisma.subjects.update({
        where: { id },
        data: dbUpdate,
      });

      return toSubjectResponse(updated as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update subject", { error });
      throw new ApiError(500, "Failed to update subject");
    }
  }

  // ===================================
  // DELETE SUBJECT (HARD DELETE)
  // ===================================
  async deleteSubject(params: SubjectIdParam) {
    try {
      const id = toSubjectId(params);

      const existing = await prisma.subjects.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Subject not found");
      }

      const deleted = await prisma.subjects.delete({
        where: { id },
      });

      return toSubjectResponse(deleted as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete subject", { error });
      throw new ApiError(500, "Failed to delete subject");
    }
  }

  // ===================================
  // COUNT SUBJECTS
  // ===================================
  async getSubjectCount(schoolId: string) {
    try {
      return prisma.subjects.count({
        where: {
          school_id: schoolId,
        },
      });
    } catch {
      logger.error("Failed to get subject count");
      throw new ApiError(500, "Failed to get subject count");
    }
  }
}
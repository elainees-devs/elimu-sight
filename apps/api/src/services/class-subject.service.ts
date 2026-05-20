import { ApiError, prisma, logger } from "@utils/index";
import {
  toClassSubjectListResponse,
  ClassSubjectDB,
  toClassSubjectId,
  toClassSubjectResponse,
  toCreateClassSubjectDB,
  toUpdateClassSubjectDB,
} from "mappers";
import {
  ClassSubjectIdParam,
  CreateClassSubjectInput,
  UpdateClassSubjectInput,
} from "schemas";
import { Prisma } from "@prisma/client";

type GetClassSubjectParams = {
  page?: number;
  limit?: number;
};

export class ClassSubjectService {
  // ===================================
  // GET SUBJECTS BY CLASS
  // ===================================
  async getSubjectsByClass(classId: string, params: GetClassSubjectParams) {
    try {
      const { page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const [classSubjects, total] = await Promise.all([
        prisma.class_subjects.findMany({
          where: { class_id: classId },
          skip,
          take: limit,
          orderBy: { created_at: "desc" },
        }),
        prisma.class_subjects.count({
          where: { class_id: classId },
        }),
      ]);

      return {
        data: toClassSubjectListResponse(classSubjects),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch class subjects");
      throw new ApiError(500, "Failed to fetch class subjects");
    }
  }

  // ===================================
  // GET BY ID
  // ===================================
  async getClassSubjectById(params: ClassSubjectIdParam) {
    try {
      const id = toClassSubjectId(params);

      const classSubject = await prisma.class_subjects.findUnique({
        where: { id },
      });

      if (!classSubject) {
        throw new ApiError(404, "Class subject not found");
      }

      return toClassSubjectResponse(classSubject as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch class subject", { error });
      throw new ApiError(500, "Failed to fetch class subject");
    }
  }

  // ===================================
  // GET BY SUBJECT
  // ===================================
  async getClassesBySubject(subjectId: string, params: GetClassSubjectParams) {
    try {
      const { page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const [classSubjects, total] = await Promise.all([
        prisma.class_subjects.findMany({
          where: { subject_id: subjectId },
          skip,
          take: limit,
          orderBy: { created_at: "desc" },
        }),
        prisma.class_subjects.count({
          where: { subject_id: subjectId },
        }),
      ]);

      return {
        data: toClassSubjectListResponse(classSubjects),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch classes by subject");
      throw new ApiError(500, "Failed to fetch classes by subject");
    }
  }

  // ===================================
  // COUNT
  // ===================================
  async getClassSubjectCount(classId: string) {
    try {
      return prisma.class_subjects.count({
        where: { class_id: classId },
      });
    } catch {
      logger.error("Failed to get class subject count");
      throw new ApiError(500, "Failed to get class subject count");
    }
  }

  // ===================================
  // CREATE
  // ===================================
  async createClassSubject(input: CreateClassSubjectInput) {
    try {
      const { classId, subjectId } = input;

      const existing = await prisma.class_subjects.findFirst({
        where: {
          class_id: classId,
          subject_id: subjectId,
        },
      });

      if (existing) {
        throw new ApiError(400, "Subject already assigned to this class");
      }

      const dbData = toCreateClassSubjectDB(input);

      const created = await prisma.class_subjects.create({
        data: dbData,
      });

      return toClassSubjectResponse(created as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to create class subject", { error });
      throw new ApiError(500, "Failed to create class subject");
    }
  }

  // ===================================
  // UPDATE
  // ===================================
  async updateClassSubject(input: UpdateClassSubjectInput) {
    try {
      const { id, ...updateData } = input;

      const existing = await prisma.class_subjects.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Class subject not found");
      }

      const dbData = toUpdateClassSubjectDB(updateData);

      const updated = await prisma.class_subjects.update({
        where: { id },
        data: dbData,
      });

      return toClassSubjectResponse(updated as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update class subject", { error });
      throw new ApiError(500, "Failed to update class subject");
    }
  }

  // ===================================
  // DELETE (FIXED: no fake updated_at)
  // ===================================
  async deleteClassSubject(params: ClassSubjectIdParam) {
    try {
      const id = toClassSubjectId(params);

      const existing = await prisma.class_subjects.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Class subject not found");
      }

      const deleted = await prisma.class_subjects.delete({
        where: { id },
      });

      return toClassSubjectResponse(deleted as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete class subject", { error });
      throw new ApiError(500, "Failed to delete class subject");
    }
  }

  // ===================================
  // ASSIGN TEACHER
  // ===================================
  async assignTeacherToClassSubject(classSubjectId: string, teacherId: string) {
    try {
      const existing = await prisma.class_subjects.findUnique({
        where: { id: classSubjectId },
      });

      if (!existing) {
        throw new ApiError(404, "Class subject not found");
      }

      const updated = await prisma.class_subjects.update({
        where: { id: classSubjectId },
        data: {
          teacher_id: teacherId,
        },
      });

      return toClassSubjectResponse(updated as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to assign teacher", { error });
      throw new ApiError(500, "Failed to assign teacher");
    }
  }

  // ===================================
  // REASSIGN TEACHER
  // ===================================
  async reassignTeacher(
  classSubjectId: string,
  newTeacherId: string
) {
  try {
    // =========================
    // CHECK IF RECORD EXISTS
    // =========================
    const existing = await prisma.class_subjects.findUnique({
      where: { id: classSubjectId },
    });

    if (!existing) {
      throw new ApiError(404, "Class subject not found");
    }

    // =========================
    // UPDATE TEACHER (REQUIRED FIELD)
    // =========================
    const updated = await prisma.class_subjects.update({
      where: { id: classSubjectId },
      data: {
        teacher_id: newTeacherId,
      },
    });

    return toClassSubjectResponse(updated as ClassSubjectDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update teacher assignment", { error });
      throw new ApiError(500, "Failed to update teacher assignment");
  }
}
  // ===================================
  // REPLACE SUBJECTS (TRANSACTION FIXED)
  // ===================================
  async replaceSubjectsForClass(
    classId: string,
    subjects: CreateClassSubjectInput[]
  ) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        await tx.class_subjects.deleteMany({
          where: { class_id: classId },
        });

        const newRecords = subjects.map((subject) => ({
          ...toCreateClassSubjectDB(subject),
          class_id: classId,
        }));

        await tx.class_subjects.createMany({
          data: newRecords,
        });

        return tx.class_subjects.findMany({
          where: { class_id: classId },
          orderBy: { created_at: "desc" },
        });
      });

      return toClassSubjectListResponse(result);
    } catch {
      logger.error("Failed to replace class subjects");
      throw new ApiError(500, "Failed to replace class subjects");
    }
  }

  // ===================================
  // SYNC SUBJECTS 
  // ===================================
  async syncSubjectsForClass(classId: string, subjects: CreateClassSubjectInput[]) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const existing = await tx.class_subjects.findMany({
          where: { class_id: classId },
        });

        const existingIds = new Set(existing.map((s) => s.subject_id));
        const incomingIds = new Set(subjects.map((s) => s.subjectId));

        const toDelete = existing.filter((s) => !incomingIds.has(s.subject_id));

        if (toDelete.length > 0) {
          await tx.class_subjects.deleteMany({
            where: {
              id: { in: toDelete.map((s) => s.id) },
            },
          });
        }

        const toAdd = subjects.filter((s) => !existingIds.has(s.subjectId));

        if (toAdd.length > 0) {
          await tx.class_subjects.createMany({
            data: toAdd.map((subject) => ({
              ...toCreateClassSubjectDB(subject),
              class_id: classId,
            })),
          });
        }

        return tx.class_subjects.findMany({
          where: { class_id: classId },
          orderBy: { created_at: "desc" },
        });
      });

      return toClassSubjectListResponse(result);
    } catch {
      logger.error("Failed to sync class subjects");
      throw new ApiError(500, "Failed to sync class subjects");
    }
  }
}
import { ApiError, prisma } from "@utils/index";
import { toClassSubjectListResponse, ClassSubjectDB , toClassSubjectId, toClassSubjectResponse, toCreateClassSubjectDB, toUpdateClassSubjectDB} from "mappers";
import { ClassSubjectIdParam, CreateClassSubjectInput, UpdateClassSubjectInput } from "schemas";
import { Prisma } from "@prisma/client";

type GetClassSubjectParams = {
  page?: number;
  limit?: number;
};

export class ClassSubjectService {
  // ===================================
  // GET ALL SUBJECTS FOR A CLASS LOGIC
  // ===================================
  async getSubjectsByClass(
    classId: string,
    params: GetClassSubjectParams
  ) {
    try {
      const { page = 1, limit = 10 } = params;

      const skip = (page - 1) * limit;

      // =========================
      // QUERY
      // =========================
      const [classSubjects, total] = await Promise.all([
        prisma.classSubjects.findMany({
          where: {
            class_id: classId,
          },
          skip,
          take: limit,
          orderBy: {
            created_at: "desc",
          },
        }),

        prisma.classSubjects.count({
          where: {
            class_id: classId,
          },
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
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch class subjects"
      );
    }
  }


  // ===================================
  // GET CLASS SUBJECT BY ID LOGIC
  // ===================================
  async getClassSubjectById(params: ClassSubjectIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toClassSubjectId(params);

      // =========================
      // QUERY
      // =========================
      const classSubject =
        await prisma.classSubjects.findUnique({
          where: { id },
        });

      if (!classSubject) {
        throw new ApiError(
          404,
          "Class subject not found"
        );
      }

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        classSubject as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to fetch class subject"
      );
    }
  }
// ===================================
  // GET CLASSES BY SUBJECT LOGIC
  // ===================================
  async getClassesBySubject(
    subjectId: string,
    params: GetClassSubjectParams
  ) {
    try {
      const { page = 1, limit = 10 } = params;

      const skip = (page - 1) * limit;

      // =========================
      // QUERY
      // =========================
      const [classSubjects, total] = await Promise.all([
        prisma.classSubjects.findMany({
          where: {
            subject_id: subjectId,
          },
          skip,
          take: limit,
          orderBy: {
            created_at: "desc",
          },
        }),

        prisma.classSubjects.count({
          where: {
            subject_id: subjectId,
          },
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
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch classes by subject"
      );
    }
  }
  // =====================================
  // COUNT ALL SUBJECTS FOR A CLASS LOGIC
  // =====================================
  async getClassSubjectCount(classId: string) {
    try {
      const count = await prisma.classSubjects.count({
        where: {
          class_id: classId,
        },
      });

      return count;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to get class subject count"
      );
    }
  }
  // ===================================
  // CREATE CLASS SUBJECT LOGIC
  // ===================================
  async createClassSubject(input: CreateClassSubjectInput) {
    try {
      const { classId, subjectId } = input;

      // =========================
      // CHECK DUPLICATE ASSIGNMENT
      // =========================
      const existing = await prisma.classSubjects.findFirst({
        where: {
          class_id: classId,
          subject_id: subjectId,
        },
      });

      if (existing) {
        throw new ApiError(
          400,
          "Subject already assigned to this class"
        );
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toCreateClassSubjectDB(input);

      // =========================
      // CREATE RECORD
      // =========================
      const classSubject = await prisma.classSubjects.create({
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        classSubject as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to create class subject"
      );
    }
  }
// ===================================
  // UPDATE CLASS SUBJECT LOGIC
  // ===================================
  async updateClassSubject(input: UpdateClassSubjectInput) {
    try {
      const { id, ...updateData } = input;

      // =========================
      // CHECK IF RECORD EXISTS
      // =========================
      const existing = await prisma.classSubjects.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(
          404,
          "Class subject not found"
        );
      }

      // =========================
      // OPTIONAL: AVOID DUPLICATE TEACHER ASSIGNMENT
      // =========================
      if (updateData.teacherId) {
        const duplicate = await prisma.classSubjects.findFirst({
          where: {
            class_id: existing.class_id,
            subject_id: existing.subject_id,
            teacher_id: updateData.teacherId,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ApiError(
            400,
            "Teacher already assigned to this class subject"
          );
        }
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toUpdateClassSubjectDB(updateData);

      // =========================
      // UPDATE RECORD
      // =========================
      const updated = await prisma.classSubjects.update({
        where: { id },
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        updated as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to update class subject"
      );
    }
  }
// ===================================
  // SOFT DELETE CLASS SUBJECT LOGIC
  // ===================================
  async deleteClassSubject(params: ClassSubjectIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toClassSubjectId(params);

      // =========================
      // SOFT DELETE
      // =========================
      const updated = await prisma.classSubjects.updateMany({
        where: {
          id,
        },
        data: {
          updated_at: new Date(),
          deleted_at: new Date(),
        },
      });

      // =========================
      // NOT FOUND CHECK
      // =========================
      if (updated.count === 0) {
        throw new ApiError(
          404,
          "Class subject not found"
        );
      }

      // =========================
      // FETCH UPDATED RECORD
      // =========================
      const classSubject =
        await prisma.classSubjects.findUnique({
          where: { id },
        });

      if (!classSubject) {
        throw new ApiError(
          404,
          "Class subject not found after deletion"
        );
      }

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        classSubject as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to delete class subject"
      );
    }
  }
  // =====================================
  // ASSIGN TEACHER TO CLASS SUBJECT LOGIC
  // =====================================
  async assignTeacherToClassSubject(
    classSubjectId: string,
    teacherId: string
  ) {
    try {
      // =========================
      // CHECK IF RECORD EXISTS
      // =========================
      const existing =
        await prisma.classSubjects.findUnique({
          where: { id: classSubjectId },
        });

      if (!existing) {
        throw new ApiError(
          404,
          "Class subject not found"
        );
      }

      // =========================
      // OPTIONAL: PREVENT DUPLICATE ASSIGNMENT
      // =========================
      const duplicate =
        await prisma.classSubjects.findFirst({
          where: {
            class_id: existing.class_id,
            subject_id: existing.subject_id,
            teacher_id: teacherId,
            NOT: { id: classSubjectId },
          },
        });

      if (duplicate) {
        throw new ApiError(
          400,
          "Teacher already assigned to this class subject"
        );
      }

      // =========================
      // UPDATE ASSIGNMENT
      // =========================
      const updated =
        await prisma.classSubjects.update({
          where: { id: classSubjectId },
          data: {
            teacher_id: teacherId,
            updated_at: new Date(),
          },
        });

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        updated as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to assign teacher"
      );
    }
  }
// ========================================
  // REMOVE TEACHER FROM CLASS SUBJECT LOGIC
  // ========================================
  async removeTeacherFromClassSubject(classSubjectId: string) {
    try {
      // =========================
      // CHECK IF RECORD EXISTS
      // =========================
      const existing =
        await prisma.classSubjects.findUnique({
          where: { id: classSubjectId },
        });

      if (!existing) {
        throw new ApiError(
          404,
          "Class subject not found"
        );
      }

      // =========================
      // REMOVE TEACHER ASSIGNMENT
      // =========================
      const updated =
        await prisma.classSubjects.update({
          where: { id: classSubjectId },
          data: {
            teacher_id: null,
            updated_at: new Date(),
          },
        });

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectResponse(
        updated as ClassSubjectDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Failed to remove teacher from class subject"
      );
    }
  }
  // REPLACE ALL SUBJECTS FOR A CLASS LOGIC
  // ===================================
  async replaceSubjectsForClass(
    classId: string,
    subjects: CreateClassSubjectInput[]
  ) {
    try {
      // =========================
      // TRANSACTION: SAFE REPLACEMENT
      // =========================
      const result = await prisma.$transaction(
  async (tx: Prisma.TransactionClient) => {
    // 1. DELETE EXISTING SUBJECTS
    await tx.classSubjects.deleteMany({
      where: {
        class_id: classId,
      },
    });

    // 2. PREPARE NEW RECORDS
    const newRecords = subjects.map((subject) => ({
      ...toCreateClassSubjectDB(subject),
      class_id: classId,
    }));

    // 3. BULK INSERT
    await tx.classSubjects.createMany({
      data: newRecords,
    });

    // 4. RETURN UPDATED DATA
    return tx.classSubjects.findMany({
      where: {
        class_id: classId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
);

      // =========================
      // MAP RESPONSE
      // =========================
      return toClassSubjectListResponse(result);
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to replace class subjects"
      );
    }
  }

}
  // ===================================
  // SYNC SUBJECTS FOR A CLASS LOGIC
  // ===================================

  // ===================================
  // ARCHIVE ALL SUBJECTS FOR A CLASS LOGIC
  // ===================================

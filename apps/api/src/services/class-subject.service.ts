import { ApiError, prisma } from "@utils/index";
import { toClassSubjectListResponse, ClassSubjectDB , toClassSubjectId, toClassSubjectResponse} from "mappers";
import { ClassSubjectIdParam } from "schemas";

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

}


  // ===================================
  // CREATE CLASS SUBJECT LOGIC
  // ===================================

  // ===================================
  // UPDATE CLASS SUBJECT LOGIC
  // ===================================

  // ===================================
  // DELETE CLASS SUBJECT LOGIC
  // ===================================

  // ===================================
  // ASSIGN TEACHER TO CLASS SUBJECT LOGIC
  // ===================================

  // ===================================
  // REMOVE TEACHER FROM CLASS SUBJECT LOGIC
  // ===================================

  // ===================================
  // REPLACE ALL SUBJECTS FOR A CLASS LOGIC
  // ===================================

  // ===================================
  // SYNC SUBJECTS FOR A CLASS LOGIC
  // ===================================

  // ===================================
  // ARCHIVE ALL SUBJECTS FOR A CLASS LOGIC
  // ===================================

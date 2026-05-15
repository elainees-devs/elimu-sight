import { ApiError, prisma, logger } from "@utils/index";
import {
  toAssessmentListResponse,
  toUpdateAssessmentDB,
  toAssessmentId,
  toCreateAssessmentDB,
  toAssessmentResponse,
  AssessmentDB,
} from "mappers";
import {
  AssessmentIdParam,
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from "schemas";

type GetAssessmentParams = {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "score" | "term" | "exam_type" | "grade";
  sortOrder?: "asc" | "desc";
  search?: string;
};

type AssessmentWhere = {
  school_id: string;
  OR?: Array<Record<string, unknown>>;
};

export class AssessmentService {
  // ===============================
  // GET ALL ASSESSMENTS
  // ===============================
  async getAllAssessments(schoolId: string, params: GetAssessmentParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      const where: AssessmentWhere = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { term: { contains: search, mode: "insensitive" } },
          { exam_type: { contains: search, mode: "insensitive" } },
          { grade: { contains: search, mode: "insensitive" } },
        ];
      }

      const orderBy =
        sortBy === "score"
          ? { score: sortOrder }
          : sortBy === "term"
          ? { term: sortOrder }
          : sortBy === "exam_type"
          ? { exam_type: sortOrder }
          : sortBy === "grade"
          ? { grade: sortOrder }
          : { created_at: sortOrder };

      const [assessments, total] = await Promise.all([
        prisma.assessments.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.assessments.count({ where }),
      ]);

      return {
        data: toAssessmentListResponse(assessments as AssessmentDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      logger.error("Failed to fetch assessments");
      throw new ApiError(500, "Failed to fetch assessments");
    }
  }

  // ===============================
  // GET BY EXAM TYPE
  // ===============================
  async getAssessmentByName(schoolId: string, examType: string) {
    try {
      const assessment = await prisma.assessments.findFirst({
        where: {
          school_id: schoolId,
          exam_type: {
            equals: examType,
            mode: "insensitive",
          },
        },
      });

      if (!assessment) {
        throw new ApiError(404, "Assessment not found");
      }

      return toAssessmentResponse(assessment as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch assessment", { error });
      throw new ApiError(500, "Failed to fetch assessment");
    }
  }

  // ===============================
  // CREATE
  // ===============================
  async createAssessment(input: CreateAssessmentInput) {
    try {
      const { schoolId, classId, studentId, subjectId, examType, term } = input;

      const existing = await prisma.assessments.findFirst({
        where: {
          school_id: schoolId,
          class_id: classId,
          student_id: studentId,
          subject_id: subjectId,
          exam_type: examType,
          term,
        },
      });

      if (existing) {
        throw new ApiError(
          400,
          "Assessment already exists for this combination"
        );
      }

      const dbData = toCreateAssessmentDB(input);

      const assessment = await prisma.assessments.create({
        data: dbData,
      });

      return toAssessmentResponse(assessment as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to create assessment", { error });
      throw new ApiError(500, "Failed to create assessment");
    }
  }

  // ===============================
  // UPDATE
  // ===============================
  async updateAssessmentDetails(id: string, input: UpdateAssessmentInput) {
    try {
      const existing = await prisma.assessments.findUnique({
        where: { id },
});

      if (!existing) {
        throw new ApiError(404, "Assessment not found");
      }

      const dbData = toUpdateAssessmentDB(input);

      const updated = await prisma.assessments.update({
        where: { id },
        data: dbData,
      });

      return toAssessmentResponse(updated as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update assessment", { error });
      throw new ApiError(500, "Failed to update assessment");
    }
  }

  // ===============================
  // DELETE
  // ===============================
  async deleteAssessment(params: AssessmentIdParam) {
    try {
      const id = toAssessmentId(params);

      const existing = await prisma.assessments.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Assessment not found");
      }

      const deleted = await prisma.assessments.delete({
        where: { id },
      });

      return toAssessmentResponse(deleted as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to delete assessment", { error });
      throw new ApiError(500, "Failed to delete assessment");
    }
  }

  // ===============================
  // COUNT
  // ===============================
  async getAssessmentCount(schoolId: string) {
    try {
      return await prisma.assessments.count({
        where: {
          school_id: schoolId,
        },
      });
    } catch {
      logger.error("Failed to get assessment count");
      throw new ApiError(500, "Failed to get assessment count");
    }
  }
}
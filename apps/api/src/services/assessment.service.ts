import { ApiError, prisma } from "@utils/index";
import { toAssessmentListResponse } from "mappers";
import { AssessmentDB, toAssessmentResponse } from "mappers/index";

type GetAssessmentParams = {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "score";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class AssessmentService {
  // ===============================
  // GET ALL ASSESSMENTS LOGIC
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

      // =========================
      // FILTER
      // =========================
      const where: any = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { term: { contains: search, mode: "insensitive" } },
          { exam_type: { contains: search, mode: "insensitive" } },
          { grade: { contains: search, mode: "insensitive" } },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [assessments, total] = await Promise.all([
        prisma.assessments.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),

        prisma.assessments.count({ where }),
      ]);

      return {
        data: toAssessmentListResponse(assessments),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch assessments");
    }
  }

// ===============================
  // GET ASSESSMENT BY NAME LOGIC
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
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch assessment");
    }
  }
}
  // ===============================
  // UPDATE ASSESSMENT DETAILS LOGIC
  // ===============================

  // ===============================
  // SOFT DELETE ASSESSMENTS LOGIC
  // ===============================

  // ===============================
  // COUNT ALL ASSESSMENTS LOGIC
  // ===============================

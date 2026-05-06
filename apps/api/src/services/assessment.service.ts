import { ApiError, prisma } from "@utils/index";
import {
  toAssessmentListResponse,
  toUpdateAssessmentDB,
  toAssessmentId,
} from "mappers";
import { AssessmentDB, toAssessmentResponse } from "mappers/index";
import { AssessmentIdParam, UpdateAssessmentInput } from "schemas";

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

  // ===============================
  // UPDATE ASSESSMENT DETAILS LOGIC
  // ===============================
  async updateAssessmentDetails(input: UpdateAssessmentInput) {
    try {
      const { id, ...updateData } = input;

      // =========================
      // CHECK IF ASSESSMENT EXISTS
      // =========================
      const existingAssessment = await prisma.assessments.findUnique({
        where: { id },
      });

      if (!existingAssessment) {
        throw new ApiError(404, "Assessment not found");
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toUpdateAssessmentDB(updateData);

      // =========================
      // UPDATE ASSESSMENT
      // =========================
      const updatedAssessment = await prisma.assessments.update({
        where: { id },
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toAssessmentResponse(updatedAssessment as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update assessment");
    }
  }

  // ===============================
  // SOFT DELETE ASSESSMENTS LOGIC
  // ===============================
  async deleteAssessment(params: AssessmentIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toAssessmentId(params);

      // =========================
      // SOFT DELETE
      // =========================
      const updated = await prisma.assessments.updateMany({
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
        throw new ApiError(404, "Assessment not found");
      }

      // =========================
      // FETCH UPDATED RECORD
      // =========================
      const assessment = await prisma.assessments.findUnique({
        where: { id },
      });

      if (!assessment) {
        throw new ApiError(404, "Assessment not found after deletion");
      }

      // =========================
      // MAP RESPONSE
      // =========================
      return toAssessmentResponse(assessment as AssessmentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to delete assessment");
    }
  }
  // ===============================
  // COUNT ALL ASSESSMENTS LOGIC
  // ===============================
  async getAssessmentCount(schoolId: string) {
    try {
      const count = await prisma.assessments.count({
        where: {
          school_id: schoolId,
          deleted_at: null,
        },
      });

      return count;
    } catch (error) {
      throw new ApiError(500, "Failed to get assessment count");
    }
  }
}

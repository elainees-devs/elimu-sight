import { prisma, ApiError } from "@utils/index";

type PaginationParams = {
  page?: number;
  limit?: number;
};

// For dashboard analytics and reporting related to insights
export class InsightAnalyticsService {
  private async paginatedQuery(
    where: Record<string, unknown>,
    params?: PaginationParams
  ) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.insights.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.insights.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ===============================
  // GET INSIGHTS BY CLASS LOGIC
  // ===============================
  async getInsightsByClass(classId: string, params?: PaginationParams) {
    try {
      const result = await this.paginatedQuery(
        { class_id: classId },
        params
      );

      return {
        classId,
        ...result,
        insights: result.data,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch insights by class");
    }
  }

  // ===============================
  // GET INSIGHTS BY STUDENT LOGIC
  // ===============================
  async getInsightsByStudent(studentId: string, params?: PaginationParams) {
    try {
      const result = await this.paginatedQuery(
        { student_id: studentId },
        params
      );

      return {
        studentId,
        ...result,
        insights: result.data,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch insights by student");
    }
  }

  // ===============================
  // GET INSIGHTS BY SUBJECT LOGIC
  // ===============================
  async getInsightsBySubject(subjectId: string, params?: PaginationParams) {
    try {
      const result = await this.paginatedQuery(
        { subject_id: subjectId },
        params
      );

      return {
        subjectId,
        ...result,
        insights: result.data,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch insights by subject");
    }
  }

  // ===============================
  // GET INSIGHTS BY TYPE LOGIC
  // ===============================
  async getInsightsByType(type: string, params?: PaginationParams) {
    try {
      const result = await this.paginatedQuery(
        { type },
        params
      );

      return {
        type,
        ...result,
        insights: result.data,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch insights by type");
    }
  }

  // ===============================
  // GET INSIGHTS BY PERIOD LOGIC
  // ===============================
  async getInsightsByPeriod(period: string, params?: PaginationParams) {
    try {
      const result = await this.paginatedQuery(
        { period },
        params
      );

      return {
        period,
        ...result,
        insights: result.data,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch insights by period");
    }
  }
}
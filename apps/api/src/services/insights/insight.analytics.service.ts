import { prisma, ApiError } from "@utils/index";

// For dashboard analytics and reporting related to insights
export class InsightAnalyticsService {
  // ===============================
  // GET INSIGHTS BY CLASS LOGIC
  // ===============================
  async getInsightsByClass(classId: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          class_id: classId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        classId,
        total: insights.length,
        insights,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights by class");
    }
  }

  // ===============================
  // GET INSIGHTS BY STUDENT LOGIC
  // ===============================
  async getInsightsByStudent(studentId: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          student_id: studentId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        studentId,
        total: insights.length,
        insights,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights by student");
    }
  }

  // ===============================
  // GET INSIGHTS BY SUBJECT LOGIC
  // ===============================
  async getInsightsBySubject(subjectId: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          subject_id: subjectId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        subjectId,
        total: insights.length,
        insights,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights by subject");
    }
  }

  // ===============================
  // GET INSIGHTS BY TYPE LOGIC
  // ===============================
  async getInsightsByType(type: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          type,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        type,
        total: insights.length,
        insights,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights by type");
    }
  }

  // ===============================
  // GET INSIGHTS BY PERIOD LOGIC
  // ===============================
  async getInsightsByPeriod(period: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          period,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        period,
        total: insights.length,
        insights,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights by period");
    }
  }
}
import { prisma, ApiError, logger } from "@utils/index";

type PaginationParams = {
  page?: number;
  limit?: number;
};

export class InsightQueryService {
  // ===============================
  // GET ALL INSIGHTS BY SCHOOL
  // ===============================
  async getAllInsightsBySchool(schoolId: string, params?: PaginationParams) {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;
      const skip = (page - 1) * limit;

      const [insights, total] = await Promise.all([
        prisma.insights.findMany({
          where: { school_id: schoolId },
          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        }),
        prisma.insights.count({ where: { school_id: schoolId } }),
      ]);

      return {
        schoolId,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        insights,
      };
    } catch {
      logger.error("Failed to fetch insights");
      throw new ApiError(500, "Failed to fetch insights");
    }
  }

  // ===============================
  // ARCHIVE INSIGHTS
  // ===============================
  async archiveInsights(insightIds: string[]) {
    try {
      if (!insightIds.length) {
        throw new ApiError(400, "No insight IDs provided");
      }

      const archived = await prisma.insights.updateMany({
        where: { id: { in: insightIds } },
        data: {
          updated_at: new Date(),
        },
      });

      return {
        archivedCount: archived.count,
      };
    } catch {
      logger.error("Failed to archive insights");
      throw new ApiError(500, "Failed to archive insights");
    }
  }

  // ===============================
  // BULK GENERATE INSIGHTS
  // ===============================
  async bulkGenerateInsights(payload: {
    schoolId: string;
    classIds?: string[];
    studentIds?: string[];
    subjectIds?: string[];
  }) {
    try {
      const { schoolId, classIds, studentIds, subjectIds } = payload;

      const [students, classes, subjects] = await Promise.all([
        studentIds?.length
          ? prisma.students.findMany({
              where: { id: { in: studentIds } },
            })
          : [],
        classIds?.length
          ? prisma.classes.findMany({
              where: { id: { in: classIds } },
            })
          : [],
        subjectIds?.length
          ? prisma.subjects.findMany({
              where: { id: { in: subjectIds } },
            })
          : [],
      ]);

      if (!students.length && !classes.length && !subjects.length) {
        throw new ApiError(
          400,
          "No valid data found for insight generation"
        );
      }

      const data: any[] = [];

      // =========================
      // STUDENTS
      // =========================
      for (const student of students) {
        data.push({
          school_id: schoolId,
          class_id: student.class_id,
          student_id: student.id,
          subject_id: subjectIds?.[0] ?? "",

          type: "STUDENT_PERFORMANCE",
          title: `Auto-generated insight for ${student.full_name}`,
          summary: "Bulk generated insight placeholder",
          data: { source: "bulk_generator" },

          confidence_score: 70,
          generated_by: "SYSTEM",
          period: "current",
        });
      }

      // =========================
      // CLASSES
      // =========================
      for (const cls of classes) {
        data.push({
          school_id: schoolId,
          class_id: cls.id,
          student_id: studentIds?.[0] ?? "",
          subject_id: subjectIds?.[0] ?? "",

          type: "CLASS_PERFORMANCE",
          title: `Auto-generated insight for class`,
          summary: "Bulk generated insight placeholder",
          data: { source: "bulk_generator" },

          confidence_score: 70,
          generated_by: "SYSTEM",
          period: "current",
        });
      }

      // =========================
      // SUBJECTS
      // =========================
      for (const subject of subjects) {
        data.push({
          school_id: schoolId,
          class_id: classIds?.[0] ?? "",
          student_id: studentIds?.[0] ?? "",
          subject_id: subject.id,

          type: "SUBJECT_PERFORMANCE",
          title: `Auto-generated insight for subject`,
          summary: "Bulk generated insight placeholder",
          data: { source: "bulk_generator" },

          confidence_score: 70,
          generated_by: "SYSTEM",
          period: "current",
        });
      }

      const created = await prisma.insights.createMany({
        data,
      });

      return {
        generatedCount: created.count,
      };
    } catch {
      logger.error("Failed to bulk generate insights");
      throw new ApiError(500, "Failed to bulk generate insights");
    }
  }

  // ===============================
  // TREND ANALYSIS
  // ===============================
  async generateTrendAnalysis(schoolId: string) {
    try {
      const insights = await prisma.insights.findMany({
        where: { school_id: schoolId },
        orderBy: { created_at: "asc" },
      });

      if (!insights.length) {
        throw new ApiError(
          404,
          "No insights available for trend analysis"
        );
      }

      const trendMap: Record<string, number> = {};

      for (const insight of insights) {
        const type = insight.type ?? "UNKNOWN";
        trendMap[type] = (trendMap[type] || 0) + 1;
      }

      const trends = Object.entries(trendMap).map(([type, count]) => ({
        type,
        count,
      }));

      return {
        schoolId,
        total: insights.length,
        trends,
        generatedAt: new Date(),
      };
    } catch {
      logger.error("Failed to generate trend analysis");
      throw new ApiError(500, "Failed to generate trend analysis");
    }
  }
}
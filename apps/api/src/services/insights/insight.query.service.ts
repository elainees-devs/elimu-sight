import { prisma } from "@utils/index";
import { ApiError } from "@utils/index";

export class InsightQueryService {
  // ===============================
  // GET ALL INSIGHTS BY SCHOOL LOGIC
  // ===============================

  async getAllInsightsBySchool(schoolId: string) {
    try {
      const insights = await prisma.insight.findMany({
        where: {
          school_id: schoolId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return insights;
    } catch (error) {
      throw new ApiError(500, "Failed to fetch insights");
    }
  }

  // ===============================
  // ARCHIVE INSIGHTS LOGIC
  // ===============================
  async archiveInsights(insightIds: string[]) {
    try {
      if (!insightIds.length) {
        throw new ApiError(400, "No insight IDs provided");
      }

      const archived = await prisma.insight.updateMany({
        where: {
          id: { in: insightIds },
        },
        data: {
          updated_at: new Date(),
          // If you have archive field, uncomment:
          // is_archived: true,
        },
      });

      return {
        archivedCount: archived.count,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to archive insights");
    }
  }

  // ===============================
  // BULK GENERATE INSIGHTS LOGIC
  // ===============================
  async bulkGenerateInsights(payload: {
    schoolId: string;
    classIds?: string[];
    studentIds?: string[];
    subjectIds?: string[];
  }) {
    try {
      const { schoolId, classIds, studentIds, subjectIds } = payload;

      // Step 1: fetch relevant data (example structure)
      const [students, classes, subjects] = await Promise.all([
        studentIds?.length
          ? prisma.student.findMany({ where: { id: { in: studentIds } } })
          : [],
        classIds?.length
          ? prisma.class.findMany({ where: { id: { in: classIds } } })
          : [],
        subjectIds?.length
          ? prisma.subject.findMany({ where: { id: { in: subjectIds } } })
          : [],
      ]);

      if (!students.length && !classes.length && !subjects.length) {
        throw new ApiError(400, "No valid data found for insight generation");
      }

      // Step 2: placeholder AI generation loop (replace with AIService later)
      const generatedInsights = [];

      for (const student of students) {
        generatedInsights.push({
          school_id: schoolId,
          student_id: student.id,
          type: "STUDENT_PERFORMANCE",
          title: `Auto-generated insight for ${student.name}`,
          summary: "Bulk generated insight placeholder",
          data: { source: "bulk_generator" },
          confidence_score: 70,
          generated_by: "SYSTEM",
          period: "current",
        });
      }

      // Step 3: store in DB
      const created = await prisma.insight.createMany({
        data: generatedInsights,
      });

      return {
        generatedCount: created.count,
      };
    } catch (error) {
      throw new ApiError(500, "Failed to bulk generate insights");
    }
  }

  // ===============================
  // TREND ANALYSIS INSIGHTS LOGIC
  // ===============================
  async generateTrendAnalysis(schoolId: string) {
    try {
      // Step 1: fetch historical insights
      const insights = await prisma.insight.findMany({
        where: {
          school_id: schoolId,
        },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!insights.length) {
        throw new ApiError(404, "No insights available for trend analysis");
      }

      // Step 2: simple trend aggregation (replace with AI later)
      const trendMap: Record<string, number> = {};

      for (const insight of insights) {
        const type = insight.type;
        trendMap[type] = (trendMap[type] || 0) + 1;
      }

      const trends = Object.entries(trendMap).map(([type, count]) => ({
        type,
        count,
      }));

      // Step 3: return structured trend result
      return {
        schoolId,
        totalInsights: insights.length,
        trends,
        generatedAt: new Date(),
      };
    } catch (error) {
      throw new ApiError(500, "Failed to generate trend analysis");
    }
  }
}

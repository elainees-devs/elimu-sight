import { Prisma } from "@prisma/client";
import { ApiError, prisma, logger } from "@utils/index";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAssessments: number;
  averageScore: number;
  atRiskCount: number;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export class DashboardService {
  async getSchoolStats(
    schoolId: string,
    role?: string,
    classId?: string
  ): Promise<DashboardStats> {
    try {
      const studentWhere: Prisma.studentsWhereInput = { school_id: schoolId, is_active: true };
      const assessmentWhere: Prisma.assessmentsWhereInput = { school_id: schoolId };
      const classWhere: Prisma.classesWhereInput = { school_id: schoolId };

      if (role === "TEACHER" && classId) {
        studentWhere.class_id = classId;
        assessmentWhere.class_id = classId;
      }

      const [totalStudents, totalTeachers, totalClasses, totalAssessments] =
        await Promise.all([
          prisma.students.count({ where: studentWhere }),
          prisma.users.count({
            where: { school_id: schoolId, role: "TEACHER", is_active: true },
          }),
          prisma.classes.count({ where: classWhere }),
          prisma.assessments.count({ where: assessmentWhere }),
        ]);

      let averageScore = 0;
      let atRiskCount = 0;

      if (totalAssessments > 0) {
        const scoreAgg = await prisma.assessments.aggregate({
          _avg: { score: true },
          where: { school_id: schoolId, ...assessmentWhere },
        });
        const avg = scoreAgg._avg.score;
        averageScore = avg ? Math.round(Number(avg) * 100) / 100 : 0;

        // At risk: students with avg score < 40
        const studentsWithAssessments = await prisma.assessments.groupBy({
          by: ["student_id"],
          where: assessmentWhere,
          _avg: { score: true },
          having: {
            score: { _avg: { lt: 40 } },
          },
        });
        atRiskCount = studentsWithAssessments.length;
      }

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAssessments,
        averageScore,
        atRiskCount,
      };
    } catch {
      logger.error("Failed to fetch dashboard stats");
      throw new ApiError(500, "Failed to fetch dashboard stats");
    }
  }

  async getRecentActivity(
    schoolId: string,
    _role?: string,
    _classId?: string
  ): Promise<RecentActivityItem[]> {
    try {
      const recent = await prisma.assessments.findMany({
        where: { school_id: schoolId },
        orderBy: { created_at: "desc" },
        take: 10,
        include: {
          students: {
            select: { full_name: true },
          },
        },
      });

      return recent.map((a) => ({
        id: a.id,
        type: "assessment",
        description: `${a.students.full_name} scored ${a.score}/${a.total_marks}`,
        timestamp: a.created_at.toISOString(),
      }));
    } catch {
      logger.error("Failed to fetch recent activity");
      throw new ApiError(500, "Failed to fetch recent activity");
    }
  }
}

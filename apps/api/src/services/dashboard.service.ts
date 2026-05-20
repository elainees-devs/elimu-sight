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

export interface StudentPerformance {
  id: string;
  fullName: string;
  averageScore: number;
  assessmentCount: number;
}

export interface ClassPerformance {
  classId: string;
  className: string;
  totalStudents: number;
  topPerformers: StudentPerformance[];
  bottomPerformers: StudentPerformance[];
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
    role?: string,
    classId?: string
  ): Promise<RecentActivityItem[]> {
    try {
      const where: Prisma.assessmentsWhereInput = { school_id: schoolId };

      if (role === "TEACHER" && classId) {
        where.class_id = classId;
      }

      const recent = await prisma.assessments.findMany({
        where,
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

  async getClassPerformance(classId: string): Promise<ClassPerformance> {
    try {
      const classData = await prisma.classes.findUnique({
        where: { id: classId },
        select: { id: true, name: true },
      });

      if (!classData) {
        throw new ApiError(404, "Class not found");
      }

      const students = await prisma.students.findMany({
        where: { class_id: classId, is_active: true },
        select: { id: true, full_name: true },
      });

      const studentIds = students.map((s) => s.id);

      const scoreAggs = await prisma.assessments.groupBy({
        by: ["student_id"],
        where: { student_id: { in: studentIds } },
        _avg: { score: true },
        _count: { score: true },
      });

      const scoreMap = new Map(
        scoreAggs.map((s) => [
          s.student_id,
          {
            averageScore: s._avg.score ? Math.round(Number(s._avg.score) * 100) / 100 : 0,
            assessmentCount: s._count.score,
          },
        ])
      );

      const performances: StudentPerformance[] = students.map((s) => {
        const stats = scoreMap.get(s.id);
        return {
          id: s.id,
          fullName: s.full_name,
          averageScore: stats?.averageScore ?? 0,
          assessmentCount: stats?.assessmentCount ?? 0,
        };
      });

      const sorted = [...performances].sort((a, b) => b.averageScore - a.averageScore);
      const topPerformers = sorted.slice(0, 5).filter((s) => s.assessmentCount > 0);
      const bottomPerformers = sorted
        .filter((s) => s.assessmentCount > 0)
        .slice(-5)
        .reverse();

      return {
        classId,
        className: classData.name,
        totalStudents: students.length,
        topPerformers,
        bottomPerformers,
      };
    } catch {
      logger.error("Failed to fetch class performance");
      throw new ApiError(500, "Failed to fetch class performance");
    }
  }
}

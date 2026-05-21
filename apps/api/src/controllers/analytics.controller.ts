import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { DashboardService } from "@services/index";
import { sendSuccess } from "@utils/response";
import { prisma } from "@utils/prisma";
import { ApiError } from "@utils/app-error";

const dashboardService = new DashboardService();

export class AnalyticsController {
  async summary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId ?? (req.query.schoolId as string);
      if (!schoolId) {
        return sendSuccess(res, {
          totalStudents: 0,
          averageScore: 0,
          passRate: 0,
          atRiskCount: 0,
        });
      }

      const stats = await dashboardService.getSchoolStats(schoolId);
      const totalStudents = stats.totalStudents;
      const passRate = totalStudents > 0
        ? Math.round((stats.totalAssessments / totalStudents) * 100)
        : 0;

      sendSuccess(res, {
        totalStudents,
        averageScore: Math.round(stats.averageScore),
        passRate,
        atRiskCount: stats.atRiskCount,
      });
    } catch (error) {
      next(error);
    }
  }

  async performance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId ?? (req.query.schoolId as string);
      if (!schoolId) {
        return sendSuccess(res, []);
      }

      const subjects = await prisma.subjects.findMany({
        where: { school_id: schoolId },
        select: { id: true, name: true },
      });

      const performanceData = await Promise.all(
        subjects.map(async (subject) => {
          const result = await prisma.assessments.aggregate({
            where: { subject_id: subject.id, school_id: schoolId },
            _avg: { score: true },
          });

          const currentAvg = Number(result._avg.score ?? 0);

          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          const oldResult = await prisma.assessments.aggregate({
            where: {
              subject_id: subject.id,
              school_id: schoolId,
              created_at: { lt: twoWeeksAgo },
            },
            _avg: { score: true },
          });

          const oldAvg = Number(oldResult._avg.score ?? 0);
          const trend: "up" | "down" | "stable" =
            currentAvg > oldAvg + 2 ? "up"
            : currentAvg < oldAvg - 2 ? "down"
            : "stable";

          return {
            subject: subject.name,
            averageScore: Math.round(currentAvg * 10) / 10,
            trend,
          };
        })
      );

      sendSuccess(res, performanceData);
    } catch (error) {
      next(error);
    }
  }

  async riskMatrix(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId ?? (req.query.schoolId as string);
      if (!schoolId) {
        return sendSuccess(res, []);
      }

      const students = await prisma.students.findMany({
        where: { school_id: schoolId, is_active: true },
        select: { id: true, full_name: true },
      });

      const riskData = await Promise.all(
        students.map(async (student) => {
          const result = await prisma.assessments.aggregate({
            where: { student_id: student.id },
            _avg: { score: true },
            _count: true,
          });

          const avg = Number(result._avg.score ?? 0);
          const count = result._count;

          let riskLevel: "low" | "medium" | "high" = "low";
          let reason = "Performing well";

          if (count === 0) {
            riskLevel = "medium";
            reason = "No assessment data available";
          } else if (avg < 30) {
            riskLevel = "high";
            reason = `Average score ${Math.round(avg)}% — critical`;
          } else if (avg < 50) {
            riskLevel = "high";
            reason = `Average score ${Math.round(avg)}% — below pass mark`;
          } else if (avg < 65) {
            riskLevel = "medium";
            reason = `Average score ${Math.round(avg)}% — needs improvement`;
          }

          return {
            studentId: student.id,
            studentName: student.full_name,
            riskLevel,
            reason,
          };
        })
      );

      sendSuccess(res, riskData);
    } catch (error) {
      next(error);
    }
  }

  async trends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId ?? (req.query.schoolId as string);
      if (!schoolId) {
        return sendSuccess(res, []);
      }

      const assessments = await prisma.assessments.findMany({
        where: { school_id: schoolId },
        select: { score: true, total_marks: true, created_at: true },
        orderBy: { created_at: "asc" },
      });

      const periodMap = new Map<string, number[]>();

      for (const a of assessments) {
        const date = new Date(a.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const pct = Number(a.total_marks) > 0 ? (Number(a.score) / Number(a.total_marks)) * 100 : 0;
        if (!periodMap.has(key)) periodMap.set(key, []);
        periodMap.get(key)!.push(pct);
      }

      const trendData = Array.from(periodMap.entries())
        .map(([period, scores]) => ({
          period,
          score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        }))
        .sort((a, b) => a.period.localeCompare(b.period));

      sendSuccess(res, trendData);
    } catch (error) {
      next(error);
    }
  }
}

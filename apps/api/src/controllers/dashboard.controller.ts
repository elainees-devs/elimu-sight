import { Response, NextFunction } from "express";
import { DashboardService } from "../services/index";
import { AuthRequest } from "../types/express";
import { prisma } from "@utils/index";

export class DashboardController {
  private dashboardService = new DashboardService();

  private async resolveClassId(req: AuthRequest): Promise<string | undefined> {
    const classId = req.query.classId as string | undefined;
    if (classId) return classId;

    if (req.user?.role === "TEACHER") {
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
        select: { assigned_class_id: true },
      });
      return user?.assigned_class_id ?? undefined;
    }

    return undefined;
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId as string;
      const role = req.user?.role;
      const classId = await this.resolveClassId(req);

      const result = await this.dashboardService.getSchoolStats(
        schoolId,
        role,
        classId
      );

      return res.status(200).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getRecentActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId as string;
      const role = req.user?.role;
      const classId = await this.resolveClassId(req);

      const result = await this.dashboardService.getRecentActivity(
        schoolId,
        role,
        classId
      );

      return res.status(200).json({
        success: true,
        message: "Recent activity fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getClassPerformance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const classId = req.params.classId as string;

      const result = await this.dashboardService.getClassPerformance(classId);

      return res.status(200).json({
        success: true,
        message: "Class performance fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

import { Response, NextFunction } from "express";
import { DashboardService } from "../services/index";
import { AuthRequest } from "../types/express";

export class DashboardController {
  private dashboardService = new DashboardService();

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId as string;
      const role = req.user?.role;
      const classId = req.query.classId as string | undefined;

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
      const classId = req.query.classId as string | undefined;

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
}

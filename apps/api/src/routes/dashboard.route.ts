import { Router } from "express";
import { DashboardController } from "@controllers/index";
import { authenticateMiddleware } from "@middlewares/index";

const router = Router();
const dashboardController = new DashboardController();

// GET /api/v1/dashboard/stats?classId=
router.get("/stats", authenticateMiddleware, (req, res, next) =>
  dashboardController.getStats(req, res, next)
);

// GET /api/v1/dashboard/recent-activity?classId=
router.get("/recent-activity", authenticateMiddleware, (req, res, next) =>
  dashboardController.getRecentActivity(req, res, next)
);

export default router;

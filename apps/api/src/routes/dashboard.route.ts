import { Router } from "express";
import { DashboardController } from "@controllers/index";
import { authenticateMiddleware } from "@middlewares/index";

const router = Router();
const dashboardController = new DashboardController();

/**
 * @openapi
 * /api/v1/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter by class
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get("/stats", authenticateMiddleware, (req, res, next) =>
  dashboardController.getStats(req, res, next)
);

/**
 * @openapi
 * /api/v1/dashboard/recent-activity:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent activity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter by class
 *     responses:
 *       200:
 *         description: Recent activity data
 */
router.get("/recent-activity", authenticateMiddleware, (req, res, next) =>
  dashboardController.getRecentActivity(req, res, next)
);

export default router;

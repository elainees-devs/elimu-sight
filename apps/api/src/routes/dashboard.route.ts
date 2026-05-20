import { Router } from "express";
import { DashboardController } from "@controllers/index";
import { authenticateMiddleware, authorize } from "@middlewares/index";

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
router.get("/stats", authenticateMiddleware, authorize("SUPER_ADMIN", "ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"), (req, res, next) =>
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
router.get("/recent-activity", authenticateMiddleware, authorize("SUPER_ADMIN", "ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"), (req, res, next) =>
  dashboardController.getRecentActivity(req, res, next)
);

/**
 * @openapi
 * /api/v1/dashboard/class-performance/{classId}:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get class performance breakdown
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class performance data
 */
router.get("/class-performance/:classId", authenticateMiddleware, authorize("ADMIN", "HEADTEACHER", "TEACHER"), (req, res, next) =>
  dashboardController.getClassPerformance(req, res, next)
);

export default router;

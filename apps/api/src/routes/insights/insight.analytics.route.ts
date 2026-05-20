import { Router } from "express";
import { InsightController } from "@controllers/index";
import { authenticateMiddleware, authorize } from "@middlewares/index";

const router = Router();
const controller = new InsightController();

/**
 * @openapi
 * /api/v1/insights/analytics/classes/{classId}/insights:
 *   get:
 *     tags: [Insights Analytics]
 *     summary: Get insights by class
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
 *         description: List of insights for the class
 */
router.get(
  "/classes/:classId/insights",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  (req, res, next) =>
    controller.getInsightsByClass(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/analytics/students/{studentId}/insights:
 *   get:
 *     tags: [Insights Analytics]
 *     summary: Get insights by student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of insights for the student
 */
router.get(
  "/students/:studentId/insights",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  (req, res, next) =>
    controller.getInsightsByStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/analytics/subjects/{subjectId}/insights:
 *   get:
 *     tags: [Insights Analytics]
 *     summary: Get insights by subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of insights for the subject
 */
router.get(
  "/subjects/:subjectId/insights",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  (req, res, next) =>
    controller.getInsightsBySubject(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/analytics/insights/type/{type}:
 *   get:
 *     tags: [Insights Analytics]
 *     summary: Get insights by type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of insights by type
 */
router.get(
  "/insights/type/:type",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  (req, res, next) =>
    controller.getInsightsByType(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/analytics/insights/period/{period}:
 *   get:
 *     tags: [Insights Analytics]
 *     summary: Get insights by period
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of insights for the period
 */
router.get(
  "/insights/period/:period",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  (req, res, next) =>
    controller.getInsightsByPeriod(req, res, next),
);

export default router;

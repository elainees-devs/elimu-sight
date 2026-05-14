import { Router } from "express";
import { InsightController } from "@controllers/index";
import { authenticateMiddleware, validateSchoolAccess } from "@middlewares/index";

const router = Router();
const controller = new InsightController();

/**
 * @openapi
 * /api/v1/insights/query/bulk-generate:
 *   post:
 *     tags: [Insights Query]
 *     summary: Bulk generate insights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bulk generation started
 */
router.post(
  "/bulk-generate",
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) =>
    controller.bulkGenerateInsights(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/query/archive:
 *   post:
 *     tags: [Insights Query]
 *     summary: Archive insights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insights archived
 */
router.post(
  "/archive",
  authenticateMiddleware,
  (req, res, next) =>
    controller.archiveInsights(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/query/school/{schoolId}:
 *   get:
 *     tags: [Insights Query]
 *     summary: Get all insights by school
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of insights
 */
router.get(
  "/school/:schoolId",
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) =>
    controller.getAllInsightsBySchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/query/schools/{schoolId}/trends:
 *   get:
 *     tags: [Insights Query]
 *     summary: Generate trend analysis for a school
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trend analysis data
 */
router.get(
  "/schools/:schoolId/trends",
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) =>
    controller.generateTrendAnalysis(req, res, next),
);

export default router;

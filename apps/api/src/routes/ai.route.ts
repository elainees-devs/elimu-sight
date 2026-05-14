import { Router } from "express";
import { AIController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
  aiRateLimiter,
  authorize,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  generateClassInsightSchema,
  generateStudentInsightSchema,
  generateSubjectInsightSchema,
  refreshInsightSchema,
  bulkGenerateInsightsSchema,
  schoolIdParamSchema,
} from "schemas/ai.schema";

const router = Router();
const aiController = new AIController();

/**
 * @openapi
 * /api/v1/ai/generate/class:
 *   post:
 *     tags: [AI]
 *     summary: Generate class insight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class insight generated
 */
router.post(
  "/generate/class",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateClassInsightSchema, "body"),
  (req, res, next) => aiController.generateClassInsight(req, res, next)
);

/**
 * @openapi
 * /api/v1/ai/generate/student:
 *   post:
 *     tags: [AI]
 *     summary: Generate student insight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student insight generated
 */
router.post(
  "/generate/student",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateStudentInsightSchema, "body"),
  (req, res, next) => aiController.generateStudentInsight(req, res, next)
);

/**
 * @openapi
 * /api/v1/ai/generate/subject:
 *   post:
 *     tags: [AI]
 *     summary: Generate subject insight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject insight generated
 */
router.post(
  "/generate/subject",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateSubjectInsightSchema, "body"),
  (req, res, next) => aiController.generateSubjectInsight(req, res, next)
);

/**
 * @openapi
 * /api/v1/ai/refresh:
 *   post:
 *     tags: [AI]
 *     summary: Refresh an insight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insightId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insight refreshed
 */
router.post(
  "/refresh",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(refreshInsightSchema, "body"),
  (req, res, next) => aiController.refreshInsight(req, res, next)
);

/**
 * @openapi
 * /api/v1/ai/bulk:
 *   post:
 *     tags: [AI]
 *     summary: Bulk generate insights
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               classIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk generation started
 */
router.post(
  "/bulk",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validateSchoolAccess,
  validate(bulkGenerateInsightsSchema, "body"),
  (req, res, next) => aiController.bulkGenerateInsights(req, res, next)
);

/**
 * @openapi
 * /api/v1/ai/health:
 *   get:
 *     tags: [AI]
 *     summary: Check AI service health
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI service health status
 */
router.get(
  "/health",
  authenticateMiddleware,
  authorize("ADMIN"),
  (req, res, next) => aiController.aiHealthCheck(req, res, next)
);

export default router;

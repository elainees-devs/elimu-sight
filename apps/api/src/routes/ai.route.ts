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

// ===============================
// AI ROUTES
// ===============================

router.post(
  "/generate/class",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateClassInsightSchema, "body"),
  (req, res, next) => aiController.generateClassInsight(req, res, next)
);

router.post(
  "/generate/student",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateStudentInsightSchema, "body"),
  (req, res, next) => aiController.generateStudentInsight(req, res, next)
);

router.post(
  "/generate/subject",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validate(generateSubjectInsightSchema, "body"),
  (req, res, next) => aiController.generateSubjectInsight(req, res, next)
);

router.post(
  "/refresh",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(refreshInsightSchema, "body"),
  (req, res, next) => aiController.refreshInsight(req, res, next)
);

router.post(
  "/bulk",
  aiRateLimiter,
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validateSchoolAccess,
  validate(bulkGenerateInsightsSchema, "body"),
  (req, res, next) => aiController.bulkGenerateInsights(req, res, next)
);

router.get(
  "/health",
  authenticateMiddleware,
  authorize("ADMIN"),
  (req, res, next) => aiController.aiHealthCheck(req, res, next)
);

export default router;

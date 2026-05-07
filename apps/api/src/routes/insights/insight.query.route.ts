import { Router } from "express";
import { InsightController } from "@controllers/index";
import { authenticateMiddleware } from "@middlewares/index";

const router = Router();
const controller = new InsightController();

// GET ALL BY SCHOOL
router.get(
  "/schools/:schoolId/insights",
  authenticateMiddleware,
  (req, res, next) => controller.getAllInsightsBySchool(req, res, next)
);

// ARCHIVE
router.post(
  "/insights/archive",
  authenticateMiddleware,
  (req, res, next) => controller.archiveInsights(req, res, next)
);

// BULK GENERATE
router.post(
  "/insights/bulk-generate",
  authenticateMiddleware,
  (req, res, next) => controller.bulkGenerateInsights(req, res, next)
);

// TREND ANALYSIS
router.get(
  "/schools/:schoolId/insights/trends",
  authenticateMiddleware,
  (req, res, next) => controller.generateTrendAnalysis(req, res, next)
);

export default router;
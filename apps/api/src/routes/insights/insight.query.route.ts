import { Router } from "express";
import { InsightController } from "@controllers/index";
import { authenticateMiddleware, validateSchoolAccess } from "@middlewares/index";

const router = Router();
const controller = new InsightController();

// =========================================
// BULK + ANALYTICS
// =========================================

router.post(
  "/bulk-generate",
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) =>
    controller.bulkGenerateInsights(req, res, next),
);

router.post(
  "/archive",
  authenticateMiddleware,
  (req, res, next) =>
    controller.archiveInsights(req, res, next),
);

router.get(
  "/schools/:schoolId/trends",
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) =>
    controller.generateTrendAnalysis(req, res, next),
);

export default router;
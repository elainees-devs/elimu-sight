import { Router } from "express";
import { InsightController } from "@controllers/index";
import { authenticateMiddleware } from "@middlewares/index";

const router = Router();
const controller = new InsightController();

// BY CLASS
router.get(
  "/classes/:classId/insights",
  authenticateMiddleware,
  (req, res, next) =>
    controller.getInsightsByClass(req, res, next),
);

// BY STUDENT
router.get(
  "/students/:studentId/insights",
  authenticateMiddleware,
  (req, res, next) =>
    controller.getInsightsByStudent(req, res, next),
);

/// BY SUBJECT
router.get(
  "/subjects/:subjectId/insights",
  authenticateMiddleware,
  (req, res, next) =>
    controller.getInsightsBySubject(req, res, next),
);

// BY TYPE
router.get(
  "/insights/type/:type",
  authenticateMiddleware,
  (req, res, next) =>
    controller.getInsightsByType(req, res, next),
);

// BY PERIOD
router.get(
  "/insights/period/:period",
  authenticateMiddleware,
  (req, res, next) =>
    controller.getInsightsByPeriod(req, res, next),
);

export default router;
import { Router } from "express";
import { AnalyticsController } from "@controllers/index";
import { authenticateMiddleware } from "@middlewares/index";

const router = Router();
const analyticsController = new AnalyticsController();

router.get("/summary", authenticateMiddleware, (req, res, next) => analyticsController.summary(req, res, next));

router.get("/performance", authenticateMiddleware, (req, res, next) => analyticsController.performance(req, res, next));

router.get("/risk-matrix", authenticateMiddleware, (req, res, next) => analyticsController.riskMatrix(req, res, next));

router.get("/trends", authenticateMiddleware, (req, res, next) => analyticsController.trends(req, res, next));

export default router;

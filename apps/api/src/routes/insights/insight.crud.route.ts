import { Router } from "express";
import { InsightController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
} from "@middlewares/index";
import { createInsightSchema, insightIdParamSchema, updateInsightSchema } from "schemas";


const router = Router();
const controller = new InsightController();

router.post("/", authenticateMiddleware, (req, res, next) =>
  controller.createInsight(req, res, next),
);

router.get("/:id", authenticateMiddleware, (req, res, next) =>
  controller.getInsightById(req, res, next),
);

router.patch("/:id", authenticateMiddleware, (req, res, next) =>
  controller.updateInsight(req, res, next),
);

router.delete("/:id", authenticateMiddleware, (req, res, next) =>
  controller.deleteInsight(req, res, next),
);

export default router;
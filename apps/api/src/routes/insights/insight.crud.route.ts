import { Router } from "express";
import { InsightController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
} from "@middlewares/index";
import { createInsightSchema, insightIdParamSchema, updateInsightSchema } from "schemas";


const router = Router();
const controller = new InsightController();

// CREATE
router.post(
  "/insights",
  authenticateMiddleware,
  validate(createInsightSchema, "body"),
  (req, res, next) => controller.createInsight(req, res, next)
);

// READ BY ID
router.get(
  "/insights/:id",
  authenticateMiddleware,
  validate(insightIdParamSchema, "params"),
  (req, res, next) => controller.getInsightById(req, res, next)
);

// UPDATE
router.patch(
  "/insights/:id",
  authenticateMiddleware,
  validate(insightIdParamSchema, "params"),
  validate(updateInsightSchema, "body"),
  (req, res, next) => controller.updateInsight(req, res, next)
);

// DELETE
router.delete(
  "/insights/:id",
  authenticateMiddleware,
  validate(insightIdParamSchema, "params"),
  (req, res, next) => controller.deleteInsight(req, res, next)
);

export default router;
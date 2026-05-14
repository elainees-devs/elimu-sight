import { Router } from "express";
import { InsightController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";
import { createInsightSchema, insightIdParamSchema, updateInsightSchema } from "schemas";

const router = Router();
const controller = new InsightController();

/**
 * @openapi
 * /api/v1/insights/crud:
 *   post:
 *     tags: [Insights CRUD]
 *     summary: Create a new insight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               type:
 *                 type: string
 *               schoolId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Insight created
 */
router.post(
  "/",
  authenticateMiddleware,
  validate(createInsightSchema, "body"),
  validateSchoolAccess,
  (req, res, next) =>
    controller.createInsight(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/crud/{id}:
 *   get:
 *     tags: [Insights CRUD]
 *     summary: Get insight by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insight data
 *       404:
 *         description: Insight not found
 */
router.get("/:id", authenticateMiddleware, (req, res, next) =>
  controller.getInsightById(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/crud/{id}:
 *   patch:
 *     tags: [Insights CRUD]
 *     summary: Update an insight
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insight updated
 */
router.patch("/:id", authenticateMiddleware, (req, res, next) =>
  controller.updateInsight(req, res, next),
);

/**
 * @openapi
 * /api/v1/insights/crud/{id}:
 *   delete:
 *     tags: [Insights CRUD]
 *     summary: Delete an insight
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insight deleted
 */
router.delete("/:id", authenticateMiddleware, (req, res, next) =>
  controller.deleteInsight(req, res, next),
);

export default router;

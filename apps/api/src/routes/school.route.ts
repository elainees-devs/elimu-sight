import { Router } from "express";
import { SchoolController } from "@controllers/index";
import {
  validate,
  authenticateMiddleware,
  authorize,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  createSchoolSchema,
  updateSchoolSchema,
  schoolIdParamSchema,
} from "../schemas";

const router = Router();
const schoolController = new SchoolController();

// ===============================
// SCHOOL ROUTES
// ===============================

/**
 * @openapi
 * /api/v1/schools:
 *   get:
 *     tags: [Schools]
 *     summary: Get all schools
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools
 */
router.get("/", authenticateMiddleware, authorize("SUPER_ADMIN"), (req, res, next) =>
  schoolController.getAllSchools(req, res, next),
);

/**
 * @openapi
 * /api/v1/schools/email/{email}:
 *   get:
 *     tags: [Schools]
 *     summary: Get school by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: School data
 *       404:
 *         description: School not found
 */
router.get("/email/:email", authenticateMiddleware, (req, res, next) =>
  schoolController.getSchoolByEmail(req, res, next),
);

/**
 * @openapi
 * /api/v1/schools:
 *   post:
 *     tags: [Schools]
 *     summary: Create a new school
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: School created
 */
router.post(
  "/",
  authenticateMiddleware,
  validate(createSchoolSchema, "body"),
  (req, res, next) => schoolController.createSchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/schools/{id}:
 *   patch:
 *     tags: [Schools]
 *     summary: Update a school
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: School updated
 */
router.patch(
  "/:id",
  validate(schoolIdParamSchema, "params"),
  authenticateMiddleware,
  validate(updateSchoolSchema, "body"),
  (req, res, next) => schoolController.updateSchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/schools/{id}:
 *   delete:
 *     tags: [Schools]
 *     summary: Delete a school
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
 *         description: School deleted
 */
router.delete(
  "/:id",
  validate(schoolIdParamSchema, "params"),
  authenticateMiddleware,
  validateSchoolAccess,
  (req, res, next) => schoolController.deleteSchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/schools/count:
 *   get:
 *     tags: [Schools]
 *     summary: Get total school count
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: School count
 */
router.get("/count", authenticateMiddleware, (req, res, next) =>
  schoolController.getSchoolCount(req, res, next),
);

export default router;

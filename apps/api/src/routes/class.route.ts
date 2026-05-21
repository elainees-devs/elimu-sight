import { Router } from "express";
import { ClassController } from "@controllers/index";
import {
  authenticateMiddleware,
  authorize,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  createClassSchema,
  updateClassSchema,
  classIdParamSchema,
  schoolIdInParamsSchema,
} from "schemas";

const router = Router();
const classController = new ClassController();

// ===============================
// CLASS ROUTES
// ===============================

/**
 * @openapi
 * /api/v1/classes/school/{schoolId}:
 *   get:
 *     tags: [Classes]
 *     summary: Get all classes by school
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of classes
 */
router.get(
  "/school/:schoolId",
  authenticateMiddleware,
  validate(schoolIdInParamsSchema, "params"),
  (req, res, next) => classController.getAllClasses(req, res, next)
);

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   get:
 *     tags: [Classes]
 *     summary: Get class by ID
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
 *         description: Class data
 *       404:
 *         description: Class not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) => classController.getClassById(req, res, next)
);

/**
 * @openapi
 * /api/v1/classes:
 *   post:
 *     tags: [Classes]
 *     summary: Create a new class
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, schoolId]
 *             properties:
 *               name:
 *                 type: string
 *               schoolId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created
 */
router.post(
  "/",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(createClassSchema, "body"),
  (req, res, next) => classController.createClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   patch:
 *     tags: [Classes]
 *     summary: Update a class
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
 *     responses:
 *       200:
 *         description: Class updated
 */
router.patch(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classIdParamSchema, "params"),
  validate(updateClassSchema, "body"),
  (req, res, next) => classController.updateClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/classes/{id}:
 *   delete:
 *     tags: [Classes]
 *     summary: Delete a class (soft delete)
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
 *         description: Class deleted
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) => classController.deleteClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/classes/school/{schoolId}/count:
 *   get:
 *     tags: [Classes]
 *     summary: Count classes in a school
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class count
 */
router.get(
  "/school/:schoolId/count",
  authenticateMiddleware,
  validate(schoolIdInParamsSchema, "params"),
  (req, res, next) => classController.getClassCount(req, res, next)
);

export default router;
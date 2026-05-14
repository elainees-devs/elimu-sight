import { Router } from "express";
import { SubjectController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  createSubjectSchema,
  subjectIdParamSchema,
  updateSubjectSchema,
} from "../schemas";

const router = Router();
const subjectController = new SubjectController();

/**
 * @openapi
 * /api/v1/subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Get all subjects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getAllSubjects(req, res, next)
);

/**
 * @openapi
 * /api/v1/subjects/name/{name}:
 *   get:
 *     tags: [Subjects]
 *     summary: Get subject by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject data
 *       404:
 *         description: Subject not found
 */
router.get(
  "/name/:name",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getSubjectByName(req, res, next)
);

/**
 * @openapi
 * /api/v1/subjects:
 *   post:
 *     tags: [Subjects]
 *     summary: Create a new subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created
 */
router.post(
  "/",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(createSubjectSchema, "body"),
  (req, res, next) =>
    subjectController.createSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/subjects/{id}:
 *   patch:
 *     tags: [Subjects]
 *     summary: Update a subject
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
 *         description: Subject updated
 */
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  validate(updateSubjectSchema, "body"),
  (req, res, next) =>
    subjectController.updateSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/subjects/{id}:
 *   delete:
 *     tags: [Subjects]
 *     summary: Delete a subject
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
 *         description: Subject deleted
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    subjectController.deleteSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/subjects/count:
 *   get:
 *     tags: [Subjects]
 *     summary: Get subject count
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subject count
 */
router.get(
  "/count",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getSubjectCount(req, res, next)
);

export default router;

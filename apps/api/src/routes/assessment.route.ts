import { Router } from "express";
import { AssessmentController } from "@controllers/index";
import { authenticateMiddleware, authorize, validate, validateSchoolAccess } from "@middlewares/index";
import {
  schoolIdParamSchema,
  assessmentSchoolAndIdParamSchema,
  updateAssessmentSchema,
  createAssessmentSchema,
} from "../schemas";

const router = Router();
const assessmentController = new AssessmentController();

/**
 * @openapi
 * /api/v1/assessments/school/{schoolId}:
 *   get:
 *     tags: [Assessments]
 *     summary: Get all assessments by school
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
 *         description: List of assessments
 */
router.get(
  "/school/:schoolId",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAllAssessments(req, res, next)
);

/**
 * @openapi
 * /api/v1/assessments/school/{schoolId}/count:
 *   get:
 *     tags: [Assessments]
 *     summary: Get assessment count
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
 *         description: Assessment count
 */
router.get(
  "/school/:schoolId/count",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentCount(req, res, next)
);

/**
 * @openapi
 * /api/v1/assessments/school/{schoolId}/exam-type/{examType}:
 *   get:
 *     tags: [Assessments]
 *     summary: Get assessment by exam type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: examType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment data
 */
router.get(
  "/school/:schoolId/exam-type/:examType",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentByName(req, res, next)
);

/**
 * @openapi
 * /api/v1/assessments:
 *   post:
 *     tags: [Assessments]
 *     summary: Create a new assessment
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
 *               examType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assessment created
 */
router.post(
  "/",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validateSchoolAccess,
  validate(createAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.createAssessment(req, res, next)
);

/**
 * @openapi
 * /api/v1/assessments/school/{schoolId}/{id}:
 *   patch:
 *     tags: [Assessments]
 *     summary: Update an assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
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
 *               examType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assessment updated
 */
router.patch(
  "/school/:schoolId/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validateSchoolAccess,
  validate(assessmentSchoolAndIdParamSchema, "params"),
  validate(updateAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.updateAssessmentDetails(req, res, next)
);

/**
 * @openapi
 * /api/v1/assessments/school/{schoolId}/{id}:
 *   delete:
 *     tags: [Assessments]
 *     summary: Delete an assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assessment deleted
 */
router.delete(
  "/school/:schoolId/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER", "TEACHER"),
  validateSchoolAccess,
  validate(assessmentSchoolAndIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.deleteAssessment(req, res, next)
);

export default router;

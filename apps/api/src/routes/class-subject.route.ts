import { Router } from "express";
import { ClassSubjectController } from "@controllers/index";
import {
  validate,
  authenticateMiddleware,
  authorize,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  classIdParamSchema,
  subjectIdParamSchema,
  classSubjectIdParamSchema,
  createClassSubjectSchema,
} from "../schemas";

const router = Router();
const classSubjectController = new ClassSubjectController();

/**
 * @openapi
 * /api/v1/class-subjects/class/{classId}/subjects:
 *   get:
 *     tags: [Class Subjects]
 *     summary: Get subjects by class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subjects for the class
 */
router.get(
  "/class/:classId/subjects",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getSubjectsByClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/{id}:
 *   get:
 *     tags: [Class Subjects]
 *     summary: Get class subject by ID
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
 *         description: Class subject data
 *       404:
 *         description: Class subject not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validate(classSubjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassSubjectById(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/subject/{subjectId}/classes:
 *   get:
 *     tags: [Class Subjects]
 *     summary: Get classes by subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of classes for the subject
 */
router.get(
  "/subject/:subjectId/classes",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassesBySubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/class/{classId}/count:
 *   get:
 *     tags: [Class Subjects]
 *     summary: Get class subject count
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class subject count
 */
router.get(
  "/class/:classId/count",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassSubjectCount(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects:
 *   post:
 *     tags: [Class Subjects]
 *     summary: Create a class subject association
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId, subjectId]
 *             properties:
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class subject created
 */
router.post(
  "/",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(createClassSubjectSchema, "body"),
  (req, res, next) =>
    classSubjectController.createClassSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/{id}:
 *   delete:
 *     tags: [Class Subjects]
 *     summary: Delete a class subject association
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
 *         description: Class subject deleted
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classSubjectIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    classSubjectController.deleteClassSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/assign-teacher:
 *   post:
 *     tags: [Class Subjects]
 *     summary: Assign a teacher to a class subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classSubjectId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher assigned
 */
router.post(
  "/assign-teacher",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  (req, res, next) =>
    classSubjectController.assignTeacherToClassSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/{id}/remove-teacher:
 *   patch:
 *     tags: [Class Subjects]
 *     summary: Remove a teacher from a class subject
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
 *         description: Teacher removed
 */
router.patch(
  "/:id/remove-teacher",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classSubjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.removeTeacherFromClassSubject(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/class/{classId}/replace:
 *   put:
 *     tags: [Class Subjects]
 *     summary: Replace all subjects for a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
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
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subjects replaced
 */
router.put(
  "/class/:classId/replace",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.replaceSubjectsForClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/class/{classId}/sync:
 *   patch:
 *     tags: [Class Subjects]
 *     summary: Sync subjects for a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subjects synced
 */
router.patch(
  "/class/:classId/sync",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.syncSubjectsForClass(req, res, next)
);

/**
 * @openapi
 * /api/v1/class-subjects/class/{classId}/archive:
 *   patch:
 *     tags: [Class Subjects]
 *     summary: Archive all subjects for a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subjects archived
 */
router.patch(
  "/class/:classId/archive",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.archiveAllSubjectsForClass(req, res, next)
);

export default router;

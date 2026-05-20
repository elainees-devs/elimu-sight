import { Router } from "express";
import { StudentController } from "@controllers/index";
import {
  authenticateMiddleware,
  authorize,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";

import {
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
  classIdParamSchema,
} from "../schemas";

const router = Router();
const studentController = new StudentController();

// ===============================
// STUDENT ROUTES
// ===============================

/**
 * @openapi
 * /api/v1/students:
 *   get:
 *     tags: [Students]
 *     summary: Get all students by school
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/", authenticateMiddleware, (req, res, next) =>
  studentController.getAllStudentsBySchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/class/{classId}:
 *   get:
 *     tags: [Students]
 *     summary: Get students by class
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
 *         description: List of students in class
 */
router.get(
  "/class/:classId",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    studentController.getStudentsByClass(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID
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
 *         description: Student data
 *       404:
 *         description: Student not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.getStudentById(req, res, next),
);

/**
 * @openapi
 * /api/v1/students:
 *   post:
 *     tags: [Students]
 *     summary: Create a new student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, admissionNumber, classId]
 *             properties:
 *               name:
 *                 type: string
 *               admissionNumber:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 */
router.post(
  "/",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validateSchoolAccess,
  validate(createStudentSchema, "body"),
  (req, res, next) =>
    studentController.createStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}:
 *   patch:
 *     tags: [Students]
 *     summary: Update a student
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
 *               admissionNumber:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated
 */
router.patch(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(studentIdParamSchema, "params"),
  validate(updateStudentSchema, "body"),
  (req, res, next) =>
    studentController.updateStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete a student
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
 *         description: Student deleted
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(studentIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    studentController.deleteStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}/activate:
 *   patch:
 *     tags: [Students]
 *     summary: Activate a student
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
 *         description: Student activated
 */
router.patch(
  "/:id/activate",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.activateStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}/deactivate:
 *   patch:
 *     tags: [Students]
 *     summary: Deactivate a student
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
 *         description: Student deactivated
 */
router.patch(
  "/:id/deactivate",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.deactivateStudent(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/{id}/transfer:
 *   patch:
 *     tags: [Students]
 *     summary: Transfer student to another class
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
 *             required: [newClassId]
 *             properties:
 *               newClassId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student transferred
 */
router.patch(
  "/:id/transfer",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.transferStudentClass(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/count:
 *   get:
 *     tags: [Students]
 *     summary: Count all students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student count
 */
router.get("/count", authenticateMiddleware, (req, res, next) =>
  studentController.countAllStudents(req, res, next),
);

/**
 * @openapi
 * /api/v1/students/statistics:
 *   get:
 *     tags: [Students]
 *     summary: Get student statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student statistics
 */
router.get("/statistics", authenticateMiddleware, (req, res, next) =>
  studentController.getStudentStatistics(req, res, next),
);

export default router;
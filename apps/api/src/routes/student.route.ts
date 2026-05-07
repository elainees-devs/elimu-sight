import { Router } from "express";
import { StudentController } from "@controllers/index";
import {
  authenticateMiddleware,
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
const studentController = StudentController;

// ===============================
// STUDENT ROUTES
// ===============================

// GET ALL STUDENTS BY SCHOOL
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) =>
    studentController.getAllStudentsBySchool(req, res, next)
);

// GET STUDENTS BY CLASS
router.get(
  "/class/:classId",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    studentController.getStudentsByClass(req, res, next)
);

// GET STUDENT BY ID
router.get(
  "/:id",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.getStudentById(req, res, next)
);

// CREATE STUDENT
router.post(
  "/",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(createStudentSchema, "body"),
  (req, res, next) =>
    studentController.createStudent(req, res, next)
);

// UPDATE STUDENT
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  validate(updateStudentSchema, "body"),
  (req, res, next) =>
    studentController.updateStudent(req, res, next)
);

// DELETE STUDENT
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    studentController.deleteStudent(req, res, next)
);

// ACTIVATE STUDENT
router.patch(
  "/:id/activate",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.activateStudent(req, res, next)
);

// DEACTIVATE STUDENT
router.patch(
  "/:id/deactivate",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.deactivateStudent(req, res, next)
);

// TRANSFER STUDENT CLASS
router.patch(
  "/:id/transfer",
  authenticateMiddleware,
  validate(studentIdParamSchema, "params"),
  (req, res, next) =>
    studentController.transferStudentClass(req, res, next)
);

// COUNT STUDENTS
router.get(
  "/count",
  authenticateMiddleware,
  (req, res, next) =>
    studentController.countAllStudents(req, res, next)
);

// STUDENT STATISTICS
router.get(
  "/statistics",
  authenticateMiddleware,
  (req, res, next) =>
    studentController.getStudentStatistics(req, res, next)
);

export default router;
import { Router } from "express";
import { AssessmentController } from "@controllers/index";
import { authenticateMiddleware, validate, validateSchoolAccess } from "@middlewares/index";
import {
  schoolIdParamSchema,
  assessmentSchoolAndIdParamSchema,
  updateAssessmentSchema,
  createAssessmentSchema,
} from "../schemas";

const router = Router();
const assessmentController = new AssessmentController();

// ===============================
// ASSESSMENT ROUTES
// ===============================

// GET ALL ASSESSMENTS BY SCHOOL
router.get(
  "/school/:schoolId",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAllAssessments(req, res, next)
);

// GET ASSESSMENT COUNT
router.get(
  "/school/:schoolId/count",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentCount(req, res, next)
);

// GET ASSESSMENT BY EXAM TYPE
router.get(
  "/school/:schoolId/exam-type/:examType",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentByName(req, res, next)
);

// CREATE ASSESSMENT
router.post(
  "/",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(createAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.createAssessment(req, res, next)
);

// UPDATE ASSESSMENT
router.patch(
  "/school/:schoolId/:id",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(assessmentSchoolAndIdParamSchema, "params"),
  validate(updateAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.updateAssessmentDetails(req, res, next)
);

// DELETE ASSESSMENT
router.delete(
  "/school/:schoolId/:id",
  authenticateMiddleware,
  validateSchoolAccess,
  validate(assessmentSchoolAndIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.deleteAssessment(req, res, next)
);

export default router;

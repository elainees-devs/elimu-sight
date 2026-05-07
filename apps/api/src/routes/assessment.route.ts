import { Router } from "express";
import { AssessmentController } from "@controllers/index";
import { authenticateMiddleware, validate } from "@middlewares/index";
import {
  schoolIdParamSchema,
  assessmentIdParamSchema,
  updateAssessmentSchema,
  createAssessmentSchema,
} from "../schemas";

const router = Router();
const assessmentController = new AssessmentController();

// ===============================
// ASSESSMENT ROUTES
// ===============================

// GET ALL ASSESSMENTS
router.get(
  "/school/:schoolId/assessments",
  authenticateMiddleware,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAllAssessments(req, res, next)
);

// GET ASSESSMENT COUNT
router.get(
  "/school/:schoolId/assessments/count",
  authenticateMiddleware,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentCount(req, res, next)
);

// GET ASSESSMENT BY NAME (examType is just a param string, not schema-typed)
router.get(
  "/school/:schoolId/assessments/:examType",
  authenticateMiddleware,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.getAssessmentByName(req, res, next)
);

// CREATE ASSESSMENT
// ===============================
router.post(
  "/assessments",
  authenticateMiddleware,
  validate(createAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.createAssessment(req, res, next)
);

// UPDATE ASSESSMENT
router.patch(
  "/assessments/:id",
  authenticateMiddleware,
  validate(assessmentIdParamSchema, "params"),
  validate(updateAssessmentSchema, "body"),
  (req, res, next) =>
    assessmentController.updateAssessmentDetails(req, res, next)
);

// DELETE (SOFT DELETE)
router.delete(
  "/assessments/:id",
  authenticateMiddleware,
  validate(assessmentIdParamSchema, "params"),
  (req, res, next) =>
    assessmentController.deleteAssessment(req, res, next)
);

export default router;
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
import { create } from "node:domain";

const router = Router();
const subjectController = new SubjectController();

// ===============================
// SUBJECT ROUTES
// ===============================

// GET ALL SUBJECTS
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getAllSubjects(req, res, next)
);

// GET SUBJECT BY NAME
router.get(
  "/name/:name",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getSubjectByName(req, res, next)
);

// CREATE SUBJECT
router.post(
  "/",
  authenticateMiddleware,
  validateSchoolAccess(),
  validate(createSubjectSchema, "body"),
  (req, res, next) =>
    subjectController.createSubject(req, res, next)
);

// UPDATE SUBJECT
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  validate(updateSubjectSchema, "body"),
  (req, res, next) =>
    subjectController.updateSubject(req, res, next)
);

// DELETE SUBJECT
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  validateSchoolAccess(),
  (req, res, next) =>
    subjectController.deleteSubject(req, res, next)
);

// GET SUBJECT COUNT
router.get(
  "/count",
  authenticateMiddleware,
  (req, res, next) =>
    subjectController.getSubjectCount(req, res, next)
);

export default router;
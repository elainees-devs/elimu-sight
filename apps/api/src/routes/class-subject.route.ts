import { Router } from "express";
import { ClassSubjectController } from "@controllers/index";
import {
  validate,
  authenticateMiddleware,
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

// ===============================
// CLASS SUBJECT ROUTES
// ===============================

// GET SUBJECTS BY CLASS
router.get(
  "/class/:classId/subjects",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getSubjectsByClass(req, res, next)
);

// GET CLASS SUBJECT BY ID
router.get(
  "/:id",
  authenticateMiddleware,
  validate(classSubjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassSubjectById(req, res, next)
);

// GET CLASSES BY SUBJECT
router.get(
  "/subject/:subjectId/classes",
  authenticateMiddleware,
  validate(subjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassesBySubject(req, res, next)
);

// GET CLASS SUBJECT COUNT
router.get(
  "/class/:classId/count",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.getClassSubjectCount(req, res, next)
);

// CREATE CLASS SUBJECT
router.post(
  "/",
  authenticateMiddleware,
  validate(createClassSubjectSchema, "body"),
  (req, res, next) =>
    classSubjectController.createClassSubject(req, res, next)
);

// DELETE CLASS SUBJECT
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(classSubjectIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    classSubjectController.deleteClassSubject(req, res, next)
);

// ASSIGN TEACHER
router.post(
  "/assign-teacher",
  authenticateMiddleware,
  (req, res, next) =>
    classSubjectController.assignTeacherToClassSubject(req, res, next)
);

// REMOVE TEACHER
router.patch(
  "/:id/remove-teacher",
  authenticateMiddleware,
  validate(classSubjectIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.removeTeacherFromClassSubject(req, res, next)
);

// REPLACE SUBJECTS FOR CLASS
router.put(
  "/class/:classId/replace",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.replaceSubjectsForClass(req, res, next)
);

// SYNC SUBJECTS FOR CLASS
router.patch(
  "/class/:classId/sync",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.syncSubjectsForClass(req, res, next)
);

// ARCHIVE ALL SUBJECTS FOR CLASS
router.patch(
  "/class/:classId/archive",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) =>
    classSubjectController.archiveAllSubjectsForClass(req, res, next)
);

export default router;
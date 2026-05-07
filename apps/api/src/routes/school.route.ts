import { Router } from "express";
import { SchoolController } from "@controllers/index";
import {
  validate,
  authenticateMiddleware,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  createSchoolSchema,
  updateSchoolSchema,
  schoolIdParamSchema,
} from "../schemas";

const router = Router();
const schoolController = new SchoolController();

// ===============================
// SCHOOL ROUTES
// ===============================

// GET ALL SCHOOLS
router.get("/", authenticateMiddleware, (req, res, next) =>
  schoolController.getAllSchools(req, res, next),
);

// GET SCHOOL BY EMAIL
router.get("/email/:email", authenticateMiddleware, (req, res, next) =>
  schoolController.getSchoolByEmail(req, res, next),
);

// CREATE SCHOOL
router.post(
  "/",
  authenticateMiddleware,
  validate(createSchoolSchema, "body"),
  (req, res, next) => schoolController.createSchool(req, res, next),
);

// UPDATE SCHOOL
router.patch(
  "/:id",
  validate(schoolIdParamSchema, "params"),
  authenticateMiddleware,
  validate(updateSchoolSchema, "body"),
  (req, res, next) => schoolController.updateSchool(req, res, next),
);

// DELETE SCHOOL
router.delete(
  "/:id",
  validate(schoolIdParamSchema, "params"),
  authenticateMiddleware,
  validateSchoolAccess(),
  (req, res, next) => schoolController.deleteSchool(req, res, next),
);

// GET SCHOOL COUNT
router.get("/count", authenticateMiddleware, (req, res, next) =>
  schoolController.getSchoolCount(req, res, next),
);

export default router;

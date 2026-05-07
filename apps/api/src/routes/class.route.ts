import { Router } from "express";
import { ClassController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  createClassSchema,
  updateClassSchema,
  classIdParamSchema,
} from "../schemas";

const router = Router();
const classController = new ClassController();

// ===============================
// CLASS ROUTES
// ===============================

// GET ALL CLASSES
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) => classController.getAllClasses(req, res, next)
);

// GET CLASS BY ID
router.get(
  "/:id",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  (req, res, next) => classController.getClassById(req, res, next)
);

// CREATE CLASS
router.post(
  "/",
  authenticateMiddleware,
  validate(createClassSchema, "body"),
  (req, res, next) => classController.createClass(req, res, next)
);

// UPDATE CLASS
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  validate(updateClassSchema, "body"),
  (req, res, next) => classController.updateClass(req, res, next)
);

// DELETE CLASS
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(classIdParamSchema, "params"),
  validateSchoolAccess(),
  (req, res, next) => classController.deleteClass(req, res, next)
);

// GET CLASS COUNT
router.get(
  "/count",
  authenticateMiddleware,
  (req, res, next) => classController.getClassCount(req, res, next)
);

export default router;
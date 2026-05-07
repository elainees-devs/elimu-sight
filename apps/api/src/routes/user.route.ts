import { Router } from "express";
import { UserController } from "@controllers/index";
import {
  authenticateMiddleware,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";
import {
  updateUserSchema,
  userIdParamSchema,
} from "../schemas/index";

const router = Router();
const userController = UserController;

// ===============================
// USER ROUTES
// ===============================

// GET ALL USERS BY SCHOOL
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) =>
    userController.getAllUsersBySchool(req, res, next)
);

// GET USER BY EMAIL
router.get(
  "/email/:email",
  authenticateMiddleware,
  (req, res, next) =>
    userController.getUserByEmail(req, res, next)
);

// GET USER COUNT
router.get(
  "/count",
  authenticateMiddleware,
  (req, res, next) =>
    userController.getUserCount(req, res, next)
);

// UPDATE USER DETAILS
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  (req, res, next) =>
    userController.updateUserDetails(req, res, next)
);

// SOFT DELETE USER
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(userIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    userController.deleteUser(req, res, next)
);

export default router;
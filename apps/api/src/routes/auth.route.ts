import { Router } from "express";
import { AuthController } from "@controllers/index";
import { authenticateMiddleware, validate } from "middlewares";
import { createUserSchema, loginSchema } from "schemas/index";


const router = Router();
const authController = new AuthController();

// ===============================
// AUTH ROUTES
// ===============================

// REGISTER
router.post(
  "/register",
  validate(createUserSchema, "body"),
  (req, res, next) => authController.register(req, res, next)
);

// LOGIN
router.post(
  "/login",
  validate(loginSchema, "body"),
  (req, res, next) => authController.login(req, res, next)
);

// GET CURRENT USER
router.get(
  "/me",
  authenticateMiddleware,
  (req, res, next) => authController.me(req, res, next)
);

export default router;
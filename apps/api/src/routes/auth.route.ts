import { Router } from "express";
import { AuthController } from "@controllers/index";
import { authenticateMiddleware, validate, authRateLimiter } from "@middlewares/index";
import { createUserSchema, loginSchema } from "schemas/index";


const router = Router();
const authController = new AuthController();

// ===============================
// AUTH ROUTES
// ===============================

// REGISTER
router.post(
  "/register",
  authRateLimiter,
  validate(createUserSchema, "body"),
  (req, res, next) => authController.register(req, res, next)
);

// LOGIN
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema, "body"),
  (req, res, next) => authController.login(req, res, next)
);

// REFRESH TOKEN
router.post(
  "/refresh",
  (req, res, next) => authController.refresh(req, res, next)
);

// LOGOUT
router.post(
  "/logout",
  authenticateMiddleware,
  (req, res, next) => authController.logout(req, res, next)
);

// GET CURRENT USER
router.get(
  "/me",
  authenticateMiddleware,
  (req, res, next) => authController.me(req, res, next)
);

export default router;
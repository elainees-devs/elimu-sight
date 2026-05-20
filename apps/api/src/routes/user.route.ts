import { Router } from "express";
import { UserController } from "@controllers/index";
import {
  authenticateMiddleware,
  authorize,
  validate,
  validateSchoolAccess,
} from "@middlewares/index";

import {
  updateUserSchema,
  userIdParamSchema,
} from "../schemas/index";

const router = Router();
const userController = new UserController();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users by school
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", authenticateMiddleware, (req, res, next) =>
  userController.getAllUsersBySchool(req, res, next),
);

/**
 * @openapi
 * /api/v1/users/email/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get("/email/:email", authenticateMiddleware, (req, res, next) =>
  userController.getUserByEmail(req, res, next),
);

/**
 * @openapi
 * /api/v1/users/count:
 *   get:
 *     tags: [Users]
 *     summary: Get user count
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User count
 */
router.get("/count", authenticateMiddleware, (req, res, next) =>
  userController.getUserCount(req, res, next),
);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  (req, res, next) =>
    userController.updateUserDetails(req, res, next),
);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Soft delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(userIdParamSchema, "params"),
  validateSchoolAccess,
  (req, res, next) =>
    userController.deleteUser(req, res, next),
);

export default router;

import { Router } from "express";
import { TeacherController } from "@controllers/index";
import {
  authenticateMiddleware,
  authorize,
  validate,
} from "@middlewares/index";
import {
  teacherIdParamSchema,
  updateTeacherSchema,
  assignClassSchema,
} from "../schemas/index";

const router = Router();
const teacherController = new TeacherController();

router.get("/", authenticateMiddleware, authorize("ADMIN", "HEADTEACHER"), (req, res, next) =>
  teacherController.listTeachers(req, res, next)
);

router.get(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(teacherIdParamSchema, "params"),
  (req, res, next) =>
    teacherController.getTeacherDetail(req, res, next)
);

router.patch(
  "/:id",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(teacherIdParamSchema, "params"),
  validate(updateTeacherSchema, "body"),
  (req, res, next) =>
    teacherController.updateTeacher(req, res, next)
);

router.post(
  "/:id/assign-class",
  authenticateMiddleware,
  authorize("ADMIN", "HEADTEACHER"),
  validate(teacherIdParamSchema, "params"),
  validate(assignClassSchema, "body"),
  (req, res, next) =>
    teacherController.assignClass(req, res, next)
);

export default router;

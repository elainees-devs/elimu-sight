import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { TeacherService } from "../services/index";

const teacherService = new TeacherService();

export class TeacherController {
  async listTeachers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: "School ID required" });
      }

      const teachers = await teacherService.listTeachers(schoolId);

      return res.status(200).json({
        success: true,
        message: "Teachers fetched successfully",
        data: teachers,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getTeacherDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: "School ID required" });
      }

      const teacher = await teacherService.getTeacherDetail(id, schoolId);

      return res.status(200).json({
        success: true,
        message: "Teacher fetched successfully",
        data: teacher,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateTeacher(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: "School ID required" });
      }

      const teacher = await teacherService.updateTeacher(id, schoolId, req.body);

      return res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        data: teacher,
      });
    } catch (error) {
      return next(error);
    }
  }

  async assignClass(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: "School ID required" });
      }

      const { classId } = req.body;
      const teacher = await teacherService.assignClass(id, schoolId, classId);

      return res.status(200).json({
        success: true,
        message: "Class assigned successfully",
        data: teacher,
      });
    } catch (error) {
      return next(error);
    }
  }
}

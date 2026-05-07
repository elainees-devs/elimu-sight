import { Request, Response, NextFunction } from "express";
import { StudentService } from "@services/index";

const studentService = new StudentService();

// ===============================
// STUDENT CONTROLLER
// ===============================
export const StudentController = {
  // =================================
  // GET ALL STUDENTS BY SCHOOL LOGIC
  // =================================
  async getAllStudentsBySchool(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const { schoolId } = req.params as { schoolId: string };

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        classId: req.query.classId as string,
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
      };

      // =========================
      // FETCH STUDENTS
      // =========================
      const result = await studentService.getAllStudentsBySchool(
        schoolId,
        params
      );

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
};
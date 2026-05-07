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
    next: NextFunction,
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
        params,
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

  // ===============================
  // CREATE STUDENT
  // ===============================
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT REQUEST BODY
      // =========================
      const input = req.body;

      // =========================
      // CREATE STUDENT
      // =========================
      const student = await studentService.createStudent(input);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // GET STUDENT BY ID
  // ===============================
  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const params = {
        id: Number(req.params.id),
      };

      // =========================
      // FETCH STUDENT
      // =========================
      const student = await studentService.getStudentById(params);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student fetched successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // UPDATE STUDENT DETAILS
  // ===============================
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS + BODY
      // =========================
      const id = Number(req.params.id);

      const input = {
        ...req.body,
        id,
      };

      // =========================
      // UPDATE STUDENT
      // =========================
      const student = await studentService.updateStudentDetails(input);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // SOFT DELETE STUDENT
  // ===============================
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const params = {
        id: Number(req.params.id),
      };

      // =========================
      // DELETE STUDENT (SOFT)
      // =========================
      const student = await studentService.deleteStudent(params);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // ACTIVATE STUDENT
  // ===============================
  async activateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const params = {
        id: Number(req.params.id),
      };

      // =========================
      // ACTIVATE STUDENT
      // =========================
      const student = await studentService.activateStudent(params);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student activated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // DEACTIVATE STUDENT
  // ===============================
  async deactivateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const params = {
        id: Number(req.params.id),
      };

      // =========================
      // DEACTIVATE STUDENT
      // =========================
      const student = await studentService.deactivateStudent(params);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student deactivated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },
  // ===============================
  // GET STUDENTS BY CLASS
  // ===============================
  async getStudentsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const { classId } = req.params as { classId: string };

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
      };

      // =========================
      // FETCH STUDENTS
      // =========================
      const result = await studentService.getStudentsByClass(classId, params);

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

  // ===============================
  // COUNT ALL STUDENTS
  // ===============================
  async countAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const { schoolId } = req.params as { schoolId: string };

      const params = {
        classId: req.query.classId as string,
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
      };

      // =========================
      // FETCH COUNT
      // =========================
      const result = await studentService.countAllStudents(schoolId, params);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Students count fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  // ===============================
  // TRANSFER STUDENT CLASS
  // ===============================
  async transferStudentClass(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS
      // =========================
      const params = {
        id: Number(req.params.id),
      };

      const { newClassId } = req.body;

      // =========================
      // TRANSFER STUDENT
      // =========================
      const student = await studentService.transferStudentClass(
        params,
        newClassId,
      );

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student transferred successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },
  // ===============================
  // GET STUDENT STATISTICS
  // ===============================
  async getStudentStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT SCHOOL ID
      // =========================
      const { schoolId } = req.params as { schoolId: string };

      // =========================
      // FETCH STATISTICS
      // =========================
      const stats = await studentService.getStudentStatistics(schoolId);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "Student statistics fetched successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};

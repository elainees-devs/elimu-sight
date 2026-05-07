import { Request, Response, NextFunction } from "express";
import { StudentService } from "@services/index";
import { toSchoolIdParam, toIdParam, toClassIdParam, toStudentIdParam } from "@utils/index";

const studentService = new StudentService();

export const StudentController = {
  // =================================
  // GET ALL STUDENTS BY SCHOOL LOGIC
  // =================================
  async getAllStudentsBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

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

      const result = await studentService.getAllStudentsBySchool(
        schoolId,
        params
      );

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
  // CREATE STUDENT LOGIC
  // ===============================
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.createStudent(req.body);

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
  // GET STUDENT BY ID LOGIC
  // ===============================
  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.getStudentById(toStudentIdParam(req));

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
  // UPDATE STUDENT LOGIC
  // ===============================
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: Number(req.params.id),
      };

      const student = await studentService.updateStudentDetails(input);

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
  // DELETE STUDENT LOGIC
  // ===============================
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.deleteStudent(toIdParam(req));

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
  // ACTIVATE STUDENT LOGIC
  // ===============================
  async activateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.activateStudent(toIdParam(req));

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
  // DEACTIVATE STUDENT LOGIC
  // ===============================
  async deactivateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.deactivateStudent(toIdParam(req));

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
  // GET STUDENTS BY CLASS LOGIC
  // ===============================
  async getStudentsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = toClassIdParam(req);

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
      };

      const result = await studentService.getStudentsByClass(
        classId,
        params
      );

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
  // COUNT ALL STUDENTS LOGIC   
  // ===============================
  async countAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const params = {
        classId: req.query.classId as string,
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
      };

      const result = await studentService.countAllStudents(
        schoolId,
        params
      );

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
  // TRANSFER STUDENT CLASS LOGIC
  // ===============================
  async transferStudentClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { newClassId } = req.body;

      const student = await studentService.transferStudentClass(
        toIdParam(req),
        newClassId
      );

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
  // GET STUDENT STATISTICS LOGIC
  // ===============================
  async getStudentStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const stats = await studentService.getStudentStatistics(schoolId);

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
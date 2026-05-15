import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/index";

import {
  toSchoolId,
  toClassId,
  toStudentId,
} from "../mappers";

import {
  SchoolIdParam,
  ClassIdParam,
  StudentIdParam,
} from "../schemas";

export class StudentController {
  private studentService = new StudentService();

  // =========================================
  // CRUD OPERATIONS
  // =========================================

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.createStudent(req.body);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = toStudentId({
        id: req.params.id,
      } as StudentIdParam);

      const result = await this.studentService.getStudentById({
        id: studentId,
      } as StudentIdParam);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.updateStudentDetails({
        ...req.body,
        id: req.params.id,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.deleteStudent({
        id: req.params.id,
      } as StudentIdParam);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =========================================
  // QUERY OPERATIONS
  // =========================================

  async getAllStudentsBySchool(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await this.studentService.getAllStudentsBySchool(
        schoolId,
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
          search: req.query.search as string,
          classId: req.query.classId as string,
          isActive:
            req.query.isActive !== undefined
              ? req.query.isActive === "true"
              : undefined,
        }
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getStudentsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassId({
        id: req.params.classId,
      } as ClassIdParam);

      const result = await this.studentService.getStudentsByClass(
        classId,
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
          search: req.query.search as string,
          isActive:
            req.query.isActive !== undefined
              ? req.query.isActive === "true"
              : undefined,
        }
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async countAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await this.studentService.countAllStudents(
        schoolId,
        {
          classId: req.query.classId as string,
          isActive:
            req.query.isActive !== undefined
              ? req.query.isActive === "true"
              : undefined,
        }
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =========================================
  // STATUS OPERATIONS
  // =========================================

  async activateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.activateStudent({
        id: req.params.id,
      } as StudentIdParam);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deactivateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.deactivateStudent({
        id: req.params.id,
      } as StudentIdParam);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =========================================
  // BUSINESS OPERATIONS
  // =========================================

  async transferStudentClass(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.studentService.transferStudentClass(
        { id: req.params.id } as StudentIdParam,
        req.body.newClassId
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getStudentStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await this.studentService.getStudentStatistics(
        schoolId
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}
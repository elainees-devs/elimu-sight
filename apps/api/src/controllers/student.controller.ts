import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
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
import { logAudit } from "@utils/index";

export class StudentController {
  private studentService = new StudentService();

  // =========================================
  // CRUD OPERATIONS
  // =========================================

  async createStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.createStudent(req.body);
      await logAudit({
        action: "STUDENT_CREATED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        details: { fullName: result.fullName },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
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

  async updateStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.updateStudentDetails({
        ...req.body,
        id: req.params.id,
      });
      await logAudit({
        action: "STUDENT_UPDATED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.deleteStudent({
        id: req.params.id,
      } as StudentIdParam);
      await logAudit({
        action: "STUDENT_DELETED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
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
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId || req.user?.schoolId,
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

  async activateStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.activateStudent({
        id: req.params.id,
      } as StudentIdParam);
      await logAudit({
        action: "STUDENT_ACTIVATED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deactivateStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.studentService.deactivateStudent({
        id: req.params.id,
      } as StudentIdParam);
      await logAudit({
        action: "STUDENT_DEACTIVATED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
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
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.studentService.transferStudentClass(
        { id: req.params.id } as StudentIdParam,
        req.body.newClassId
      );
      await logAudit({
        action: "STUDENT_CLASS_TRANSFERRED",
        resource: "students",
        resourceId: result.id,
        schoolId: result.schoolId,
        userId: req.user?.id,
        details: { newClassId: req.body.newClassId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
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
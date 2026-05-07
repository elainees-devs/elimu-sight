import { Request, Response, NextFunction } from "express";
import { ClassSubjectService } from "@services/index";
import {
  toClassIdParam,
  toIdParam,
  toSubjectIdParam,
} from "@utils/index";

const classSubjectService = new ClassSubjectService();

export class ClassSubjectController {
  // ===================================
  // GET SUBJECTS BY CLASS
  // ===================================
  async getSubjectsByClass(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { classId } = toClassIdParam(req);

      const result =
        await classSubjectService.getSubjectsByClass(
          classId,
          {
            page: req.query.page
              ? Number(req.query.page)
              : undefined,
            limit: req.query.limit
              ? Number(req.query.limit)
              : undefined,
          }
        );

      return res.status(200).json({
        success: true,
        message: "Class subjects fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET CLASS SUBJECT BY ID
  // ===================================
  async getClassSubjectById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await classSubjectService.getClassSubjectById(
          toIdParam(req)
        );

      return res.status(200).json({
        success: true,
        message: "Class subject fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET CLASSES BY SUBJECT
  // ===================================
  async getClassesBySubject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { subjectId } = toSubjectIdParam(req);

      const result =
        await classSubjectService.getClassesBySubject(
          subjectId,
          {
            page: req.query.page
              ? Number(req.query.page)
              : undefined,
            limit: req.query.limit
              ? Number(req.query.limit)
              : undefined,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Classes by subject fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =====================================
  // GET CLASS SUBJECT COUNT
  // =====================================
  async getClassSubjectCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { classId } = toClassIdParam(req);

      const count =
        await classSubjectService.getClassSubjectCount(
          classId
        );

      return res.status(200).json({
        success: true,
        message:
          "Class subject count fetched successfully",
        data: {
          count,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE CLASS SUBJECT
  // ===================================
  async createClassSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const classSubject =
        await classSubjectService.createClassSubject(
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Class subject created successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE CLASS SUBJECT
  // ===================================
  async deleteClassSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const classSubject =
        await classSubjectService.deleteClassSubject(
          toIdParam(req)
        );

      return res.status(200).json({
        success: true,
        message:
          "Class subject deleted successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =====================================
  // ASSIGN TEACHER TO CLASS SUBJECT
  // =====================================
  async assignTeacherToClassSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { classSubjectId, teacherId } = req.body;

      const classSubject =
        await classSubjectService.assignTeacherToClassSubject(
          classSubjectId,
          teacherId
        );

      return res.status(200).json({
        success: true,
        message: "Teacher assigned successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

 // ========================================
// REMOVE TEACHER FROM CLASS SUBJECT
// ========================================
async removeTeacherFromClassSubject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = toIdParam(req);

    const classSubject =
      await classSubjectService.removeTeacherFromClassSubject(
        String(id)
      );

    return res.status(200).json({
      success: true,
      message:
        "Teacher removed from class subject successfully",
      data: classSubject,
    });
  } catch (error) {
    return next(error);
  }
}
}
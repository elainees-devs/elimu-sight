import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { ClassSubjectService } from "../services/index";
import { toClassSubjectId } from "../mappers";
import { ClassSubjectIdParam } from "../schemas";
import { logAudit } from "@utils/index";

const classSubjectService = new ClassSubjectService();

export class ClassSubjectController {
  // ===================================
  // GET SUBJECTS BY CLASS
  // ===================================
  async getSubjectsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const result = await classSubjectService.getSubjectsByClass(id, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

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
  async getClassSubjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const result = await classSubjectService.getClassSubjectById({ id });

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
  async getClassesBySubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectId = toClassSubjectId({ id: req.params.subjectId } as ClassSubjectIdParam);

      const result = await classSubjectService.getClassesBySubject(subjectId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Classes by subject fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =====================================
  // GET CLASS SUBJECT COUNT
  // =====================================
  async getClassSubjectCount(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const count = await classSubjectService.getClassSubjectCount(classId);

      return res.status(200).json({
        success: true,
        message: "Class subject count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE CLASS SUBJECT
  // ===================================
  async createClassSubject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const classSubject = await classSubjectService.createClassSubject(req.body);

      await logAudit({
        action: "CLASS_SUBJECT_CREATED",
        resource: "class_subjects",
        resourceId: classSubject.id,
        userId: req.user?.id,
        details: { classId: classSubject.classId, subjectId: classSubject.subjectId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(201).json({
        success: true,
        message: "Class subject created successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE CLASS SUBJECT
  // ===================================
  async deleteClassSubject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const classSubject = await classSubjectService.deleteClassSubject({ id });

      await logAudit({
        action: "CLASS_SUBJECT_DELETED",
        resource: "class_subjects",
        resourceId: classSubject.id,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(200).json({
        success: true,
        message: "Class subject deleted successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =====================================
  // ASSIGN TEACHER
  // =====================================
  async assignTeacherToClassSubject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { classSubjectId, teacherId } = req.body;

      const classSubject =
        await classSubjectService.assignTeacherToClassSubject(classSubjectId, teacherId);

      await logAudit({
        action: "TEACHER_ASSIGNED",
        resource: "class_subjects",
        resourceId: classSubject.id,
        userId: req.user?.id,
        details: { teacherId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(200).json({
        success: true,
        message: "Teacher assigned successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // =====================================
  // REMOVE TEACHER
  // =====================================
  async removeTeacherFromClassSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const classSubjectId = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);
      const { newTeacherId } = req.body;

      if (!newTeacherId) {
        throw new Error("newTeacherId is required");
      }

      const classSubject =
        await classSubjectService.removeTeacherFromClassSubject(classSubjectId, newTeacherId);

      return res.status(200).json({
        success: true,
        message: "Teacher removed from class subject successfully",
        data: classSubject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // REPLACE SUBJECTS
  // ===================================
  async replaceSubjectsForClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const subjects = req.body;

      const classSubjects =
        await classSubjectService.replaceSubjectsForClass(classId, subjects);

      return res.status(200).json({
        success: true,
        message: "Class subjects replaced successfully",
        data: classSubjects,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // SYNC SUBJECTS
  // ===================================
  async syncSubjectsForClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const subjects = req.body;

      const classSubjects =
        await classSubjectService.syncSubjectsForClass(classId, subjects);

      return res.status(200).json({
        success: true,
        message: "Class subjects synced successfully",
        data: classSubjects,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // ARCHIVE SUBJECTS
  // ===================================
  async archiveAllSubjectsForClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassSubjectId({ id: req.params.id } as ClassSubjectIdParam);

      const classSubjects =
        await classSubjectService.syncSubjectsForClass(classId, []); // sync with empty array to archive all

      return res.status(200).json({
        success: true,
        message: "Class subjects archived successfully",
        data: classSubjects,
      });
    } catch (error) {
      return next(error);
    }
  }
}
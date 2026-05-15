import { Request, Response, NextFunction } from "express";
import { SubjectService } from "../services/index";

import { toSubjectId, toSchoolId } from "../mappers";
import { SubjectIdParam, SchoolIdParam } from "../schemas";

const subjectService = new SubjectService();

export class SubjectController {
  // ===================================
  // GET ALL SUBJECTS
  // ===================================
  async getAllSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await subjectService.getAllSubjects(schoolId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as "name" | "created_at",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        search: req.query.search ? String(req.query.search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Subjects fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET SUBJECT BY NAME
  // ===================================
  async getSubjectByName(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const name = req.params.name as string;

      const subject = await subjectService.getSubjectByName(
        schoolId,
        name
      );

      return res.status(200).json({
        success: true,
        message: "Subject fetched successfully",
        data: subject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE SUBJECT
  // ===================================
  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await subjectService.createSubject(req.body);

      return res.status(201).json({
        success: true,
        message: "Subject created successfully",
        data: subject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // UPDATE SUBJECT
  // ===================================
  async updateSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: req.params.id,
      };

      const subject = await subjectService.updateSubjectDetails(input);

      return res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data: subject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE SUBJECT
  // ===================================
  async deleteSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toSubjectId({
        id: req.params.id,
      } as SubjectIdParam);

      const subject = await subjectService.deleteSubject({ id });

      return res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        data: subject,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET SUBJECT COUNT
  // ===================================
  async getSubjectCount(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const count = await subjectService.getSubjectCount(schoolId);

      return res.status(200).json({
        success: true,
        message: "Subject count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }
}
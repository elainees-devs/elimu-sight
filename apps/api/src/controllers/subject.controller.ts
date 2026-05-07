import { Request, Response, NextFunction } from "express";
import { SubjectService } from "@services/index";
import { toIdParam, toNameParam, toSchoolIdParam } from "@utils/index";

const subjectService = new SubjectService();

export class SubjectController {
  // ===============================
  // GET ALL SUBJECTS
  // ===============================
  async getAllSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as "name" | "created_at",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        search: req.query.search as string,
      };

      const result = await subjectService.getAllSubjects(
        schoolId,
        params
      );

      res.status(200).json({
        success: true,
        message: "Subjects fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // GET SUBJECT BY NAME
  // ===============================
  async getSubjectByName(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);
      const { name } = toNameParam(req);

      const subject = await subjectService.getSubjectByName(
        schoolId,
        name
      );

      res.status(200).json({
        success: true,
        message: "Subject fetched successfully",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // UPDATE SUBJECT DETAILS
  // ===============================
  async updateSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: Number(req.params.id),
      };

      const subject = await subjectService.updateSubjectDetails(input);

      res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // DELETE SUBJECT
  // ===============================
  async deleteSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await subjectService.deleteSubject(toIdParam(req));

      res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // GET SUBJECT COUNT
  // ===============================
  async getSubjectCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const count = await subjectService.getSubjectCount(schoolId);

      res.status(200).json({
        success: true,
        message: "Subject count fetched successfully",
        data: {
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
import { Request, Response, NextFunction } from "express";
import { AssessmentService } from "@services/index";
import { toAssessmentId, toSchoolId } from "mappers";
import { AssessmentIdParam, SchoolIdParam } from "schemas";

const assessmentService = new AssessmentService();

export class AssessmentController {
  // ===================================
  // GET ALL ASSESSMENTS
  // ===================================
  async getAllAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const { page, limit, sortBy, sortOrder, search } = req.query;

      const result = await assessmentService.getAllAssessments(schoolId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: search ? String(search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Assessments fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET ASSESSMENT BY EXAM TYPE
  // ===================================
  async getAssessmentByName(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const { examType } = req.params;

      const assessment = await assessmentService.getAssessmentByName(
        schoolId,
        String(examType)
      );

      return res.status(200).json({
        success: true,
        message: "Assessment fetched successfully",
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE ASSESSMENT
  // ===================================
  async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await assessmentService.createAssessment(req.body);

      return res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // UPDATE ASSESSMENT
  // ===================================
  async updateAssessmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await assessmentService.updateAssessmentDetails(String(req.params.id), req.body);

      return res.status(200).json({
        success: true,
        message: "Assessment updated successfully",
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE ASSESSMENT
  // ===================================
  async deleteAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toAssessmentId({
        id: req.params.id,
      } as AssessmentIdParam);

      const assessment = await assessmentService.deleteAssessment({ id });

      return res.status(200).json({
        success: true,
        message: "Assessment deleted successfully",
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET ASSESSMENT COUNT
  // ===================================
  async getAssessmentCount(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const count = await assessmentService.getAssessmentCount(schoolId);

      return res.status(200).json({
        success: true,
        message: "Assessment count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }
}
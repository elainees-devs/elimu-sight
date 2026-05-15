import { Request, Response, NextFunction } from "express";
import { InsightService } from "../services/index";
import {
  toInsightId,
  toSchoolId,
  toClassId,
  toStudentId,
  toSubjectId,
} from "../mappers";

import {
  InsightIdParam,
  SchoolIdParam,
  ClassIdParam,
  StudentIdParam,
  SubjectIdParam,
} from "../schemas";
import { InsightAnalyticsService } from "../services/insights/insight.analytics.service";
import { InsightCrudService, InsightQueryService } from "../services/insights";

export class InsightController {
  private insightService = new InsightService(
    new InsightCrudService(),
    new InsightQueryService(),
    new InsightAnalyticsService()
  );

  // =========================================
  // CRUD OPERATIONS
  // =========================================

  async createInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.insightService.createInsight(req.body);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getInsightById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInsightId({ id: req.params.id } as InsightIdParam);

      const result = await this.insightService.getInsightById(id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInsightId({ id: req.params.id } as InsightIdParam);

      const result = await this.insightService.updateInsight(id, req.body);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toInsightId({ id: req.params.id } as InsightIdParam);

      const result = await this.insightService.deleteInsight(id);

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

  async getAllInsightsBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await this.insightService.getAllInsightsBySchool(
        schoolId,
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
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

  async archiveInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.insightService.archiveInsights(
        req.body.insightIds
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async bulkGenerateInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.insightService.bulkGenerateInsights({
        schoolId: req.body.schoolId,
        classIds: req.body.classIds,
        studentIds: req.body.studentIds,
        subjectIds: req.body.subjectIds,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async generateTrendAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await this.insightService.generateTrendAnalysis(
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

  // =========================================
  // ANALYTICS OPERATIONS
  // =========================================

  async getInsightsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = toClassId({
        id: req.params.classId,
      } as ClassIdParam);

      const result = await this.insightService.getInsightsByClass(classId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getInsightsByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = toStudentId({
        id: req.params.studentId,
      } as StudentIdParam);

      const result = await this.insightService.getInsightsByStudent(
        studentId,
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
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

  async getInsightsBySubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectId = toSubjectId({
        id: req.params.subjectId,
      } as SubjectIdParam);

      const result = await this.insightService.getInsightsBySubject(
        subjectId,
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
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

  async getInsightsByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params as { type: string };

      const result = await this.insightService.getInsightsByType(type, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getInsightsByPeriod(req: Request, res: Response, next: NextFunction) {
    try {
      const { period } = req.params as { period: string };

      const result = await this.insightService.getInsightsByPeriod(period, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}
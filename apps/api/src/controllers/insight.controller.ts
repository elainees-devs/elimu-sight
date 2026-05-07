import { Request, Response, NextFunction } from "express";
import { InsightService } from "@services/index";
import { toClassIdParam, toIdParam, toSchoolIdParam, toStudentIdParam, toSubjectIdParam } from "@utils/index";

export class InsightController {
  private insightService = new InsightService(
    new (require("@services/index").InsightCrudService)(),
    new (require("@services/index").InsightQueryService)(),
    new (require("@services/index").InsightAnalyticsService)()
  );

  // =========================================
  // CRUD OPERATIONS
  // =========================================

  async createInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.insightService.createInsight(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = toIdParam(req);

      const result = await this.insightService.getInsightById(id.toString());

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = toIdParam(req);

      const result = await this.insightService.updateInsight(id.toString(), req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = toIdParam(req);

      const result = await this.insightService.deleteInsight(id.toString());

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================
  // QUERY OPERATIONS
  // =========================================

  async getAllInsightsBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const result = await this.insightService.getAllInsightsBySchool(
        schoolId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { insightIds } = req.body;

      const result = await this.insightService.archiveInsights(insightIds);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkGenerateInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {
        schoolId: req.body.schoolId,
        classIds: req.body.classIds,
        studentIds: req.body.studentIds,
        subjectIds: req.body.subjectIds,
      };

      const result = await this.insightService.bulkGenerateInsights(payload);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateTrendAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const result = await this.insightService.generateTrendAnalysis(
        schoolId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================
  // ANALYTICS OPERATIONS
  // =========================================

  async getInsightsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = toClassIdParam(req);

      const result = await this.insightService.getInsightsByClass(classId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightsByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = toStudentIdParam(req);

      const result = await this.insightService.getInsightsByStudent(
        studentId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightsBySubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId } = toSubjectIdParam(req);

      const result = await this.insightService.getInsightsBySubject(
        subjectId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightsByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params as { type: string };

      const result = await this.insightService.getInsightsByType(type);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightsByPeriod(req: Request, res: Response, next: NextFunction) {
    try {
      const { period } = req.params as { period: string };

      const result = await this.insightService.getInsightsByPeriod(period);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
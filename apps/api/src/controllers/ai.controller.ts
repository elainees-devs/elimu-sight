import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { InsightAIService } from "@services/insights/insight.ai.service";
import { AIService } from "ai/ai.service";
import {
  GenerateClassInsightInput,
  GenerateStudentInsightInput,
  GenerateSubjectInsightInput,
  RefreshInsightInput,
  BulkGenerateInsightsInput,
} from "schemas/ai.schema";
import { sendSuccess, sendCreated } from "@utils/response";

export class AIController {
  private insightAIService = new InsightAIService();
  private aiService = new AIService();

  async generateClassInsight(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { classId, schoolId } = req.body as GenerateClassInsightInput;
      const result = await this.insightAIService.generateClassInsight(classId, schoolId);
      sendCreated(res, result, "Class insight generated successfully");
    } catch (error) {
      next(error);
    }
  }

  async generateStudentInsight(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, schoolId } = req.body as GenerateStudentInsightInput;
      const result = await this.insightAIService.generateStudentInsight(studentId, schoolId);
      sendCreated(res, result, "Student insight generated successfully");
    } catch (error) {
      next(error);
    }
  }

  async generateSubjectInsight(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subjectId, schoolId } = req.body as GenerateSubjectInsightInput;
      const result = await this.insightAIService.generateSubjectInsight(subjectId, schoolId);
      sendCreated(res, result, "Subject insight generated successfully");
    } catch (error) {
      next(error);
    }
  }

  async refreshInsight(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { insightId } = req.body as RefreshInsightInput;
      const result = await this.insightAIService.refreshInsight(insightId);
      sendSuccess(res, result, "Insight refreshed successfully");
    } catch (error) {
      next(error);
    }
  }

  async bulkGenerateInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { schoolId, studentIds, classIds, subjectIds } = req.body as BulkGenerateInsightsInput;
      const result = await this.insightAIService.generateBulkInsights({
        schoolId,
        studentIds,
        classIds,
        subjectIds,
      });
      sendCreated(res, result, "Bulk insights generation completed");
    } catch (error) {
      next(error);
    }
  }

  async aiHealthCheck(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.aiService.healthCheck();
      sendSuccess(res, result, "AI service is healthy");
    } catch (error) {
      next(error);
    }
  }
}

import {
  InsightAnalyticsService,
  InsightCrudService,
  InsightQueryService,
} from "./insights";

export class InsightService {
  constructor(
    private crud: InsightCrudService,
    private query: InsightQueryService,
    private analytics: InsightAnalyticsService,
  ) {}

  // =========================================
  // CRUD OPERATIONS
  // =========================================

  createInsight(data: any) {
    return this.crud.createInsight(data);
  }

  getInsightById(id: string) {
    return this.crud.getInsightById(id);
  }

  updateInsight(id: string, data: any) {
    return this.crud.updateInsight(id, data);
  }

  deleteInsight(id: string) {
    return this.crud.deleteInsight(id);
  }

    // =========================================
  // QUERY OPERATIONS
  // =========================================

  getAllInsightsBySchool(schoolId: string, params?: { page?: number; limit?: number }) {
    return this.query.getAllInsightsBySchool(schoolId, params);
  }

  archiveInsights(insightIds: string[]) {
    return this.query.archiveInsights(insightIds);
  }

  bulkGenerateInsights(payload: {
    schoolId: string;
    classIds?: string[];
    studentIds?: string[];
    subjectIds?: string[];
  }) {
    return this.query.bulkGenerateInsights(payload);
  }

  generateTrendAnalysis(schoolId: string) {
    return this.query.generateTrendAnalysis(schoolId);
  }  

  // =========================================
  // ANALYTICS OPERATIONS
  // =========================================

  getInsightsByClass(classId: string, params?: { page?: number; limit?: number }) {
    return this.analytics.getInsightsByClass(classId, params);
  }

  getInsightsByStudent(studentId: string, params?: { page?: number; limit?: number }) {
    return this.analytics.getInsightsByStudent(studentId, params);
  }

  getInsightsBySubject(subjectId: string, params?: { page?: number; limit?: number }) {
    return this.analytics.getInsightsBySubject(subjectId, params);
  }

  getInsightsByType(type: string, params?: { page?: number; limit?: number }) {
    return this.analytics.getInsightsByType(type, params);
  }

  getInsightsByPeriod(period: string, params?: { page?: number; limit?: number }) {
    return this.analytics.getInsightsByPeriod(period, params);
  }


}





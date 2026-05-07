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

  getAllInsightsBySchool(schoolId: string) {
    return this.query.getAllInsightsBySchool(schoolId);
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

  getInsightsByClass(classId: string) {
    return this.analytics.getInsightsByClass(classId);
  }

  getInsightsByStudent(studentId: string) {
    return this.analytics.getInsightsByStudent(studentId);
  }

  getInsightsBySubject(subjectId: string) {
    return this.analytics.getInsightsBySubject(subjectId);
  }

  getInsightsByType(type: string) {
    return this.analytics.getInsightsByType(type);
  }

  getInsightsByPeriod(period: string) {
    return this.analytics.getInsightsByPeriod(period);
  }


}





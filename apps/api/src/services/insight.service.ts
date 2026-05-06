import { InsightAnalyticsService, InsightAIService, InsightCrudService, InsightQueryService, InsightAdvancedService } from './insights';

export class InsightService {
    constructor(
        private crud: InsightCrudService,
        private query: InsightQueryService,
        private analytics: InsightAnalyticsService,
        private ai: InsightAIService,
        private advanced: InsightAdvancedService
    ) {

    }
}






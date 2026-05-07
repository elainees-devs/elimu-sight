import axios, { AxiosInstance } from "axios";
import { ApiError } from "@utils/index";

export class AIService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || "http://localhost:8000";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // =========================================
  // GENERATE CLASS INSIGHT (FASTAPI CLIENT)
  // =========================================
  async generateClassInsight(payload: unknown) {
    return this.requestWithRetry("/insights/class", payload);
  }

  // =========================================
  // GENERATE STUDENT INSIGHT (FASTAPI CLIENT)
  // =========================================
  async generateStudentInsight(payload: unknown) {
    return this.requestWithRetry("/insights/student", payload);
  }

  // =========================================
  // GENERATE SUBJECT INSIGHT (FASTAPI CLIENT)
  // =========================================
  async generateSubjectInsight(payload: unknown) {
    return this.requestWithRetry("/insights/subject", payload);
  }

  // =========================================
  // REFRESH INSIGHTS (FASTAPI CLIENT)
  // =========================================
  async refreshInsights(payload: unknown) {
    return this.requestWithRetry("/insights/refresh", payload);
  }

  // =========================================
  // BULK GENERATE INSIGHTS (FASTAPI CLIENT)
  // =========================================
  async bulkGenerateInsights(payload: unknown) {
    return this.requestWithRetry("/insights/bulk", payload);
  }

  // =========================================
  // AI SERVICE HEALTH CHECK
  // =========================================
  async healthCheck() {
    try {
      const res = await this.client.get("/health");
      return {
        status: res.status,
        data: res.data,
      };
    } catch (error) {
      throw new ApiError(503, "AI service is unavailable");
    }
  }

  // =========================================
  // REQUEST WITH RETRY LOGIC
  // =========================================
  private async requestWithRetry(
    endpoint: string,
    payload: unknown,
    retries = 3
  ): Promise<any> {
    try {
      const response = await this.client.post(endpoint, payload);

      return this.normalizeAIResponse(response.data);
    } catch (error: any) {
      if (retries > 0) {
        return this.requestWithRetry(endpoint, payload, retries - 1);
      }

      return this.handleAIRequestError(error);
    }
  }

  // =========================================
  // NORMALIZE AI RESPONSE
  // =========================================
  private normalizeAIResponse(response: any) {
    return {
      title: response?.title || "AI Insight",
      summary: response?.summary || "",
      data: response?.data || {},
      confidenceScore: response?.confidenceScore ?? 50,
      raw: response,
    };
  }

  // =========================================
  // HANDLE AI REQUEST ERRORS
  // =========================================
  private handleAIRequestError(error: any): never {
    if (error.response) {
      throw new ApiError(
        error.response.status || 500,
        error.response.data?.message || "AI service error"
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new ApiError(504, "AI service timeout");
    }

    throw new ApiError(500, "AI service request failed");
  }
}
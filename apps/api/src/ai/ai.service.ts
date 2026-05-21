import axios, { AxiosInstance, AxiosError } from "axios";
import Joi from "joi";
import { ApiError } from "../utils/app-error";
import { env } from "../config/env";
import { logger } from "../utils/logger";

// =========================================
// CIRCUIT BREAKER STATE
// =========================================
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private readonly threshold = 5,
    private readonly windowMs = 60000,
    private readonly cooldownMs = 30000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.cooldownMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new ApiError(503, "AI service circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.state = "CLOSED";
    this.failureCount = 0;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (
      this.state === "HALF_OPEN" ||
      this.failureCount >= this.threshold
    ) {
      this.state = "OPEN";
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// =========================================
// AI RESPONSE SCHEMA VALIDATION
// =========================================
const aiResponseSchema = Joi.object({
  title: Joi.string().required(),
  summary: Joi.string().allow("").optional(),
  data: Joi.object().unknown(true).optional(),
  confidenceScore: Joi.number().min(0).max(100).optional(),
}).options({ presence: "required" });

type AIResponseValidation = {
  title: string;
  summary: string;
  data: Record<string, unknown>;
  confidenceScore: number;
};

function validateAIResponse(response: unknown): AIResponseValidation {
  const { error, value } = aiResponseSchema.validate(response, {
    stripUnknown: true,
  });

  if (error) {
    logger.warn("AI response validation failed", {
      error: error.message,
      response,
    });
    return {
      title: "AI Insight",
      summary: "",
      data: {},
      confidenceScore: 50,
    };
  }

  return {
    title: value.title,
    summary: value.summary ?? "",
    data: (value.data as Record<string, unknown>) ?? {},
    confidenceScore: value.confidenceScore ?? 50,
  };
}

// =========================================
// EXPONENTIAL BACKOFF
// =========================================
function backoffDelay(attempt: number): number {
  const base = 1000;
  const max = 8000;
  const exponential = Math.min(base * Math.pow(2, attempt), max);
  const jitter = Math.random() * 500;
  return exponential + jitter;
}

// =========================================
// AI SERVICE RESPONSE TYPE
// =========================================
export interface AIServiceResponse {
  title: string;
  summary: string;
  data: Record<string, unknown>;
  confidenceScore: number;
  raw: unknown;
}

// =========================================
// AI SERVICE
// =========================================
export class AIService {
  private client: AxiosInstance;
  private baseURL: string;
  private circuitBreaker = new CircuitBreaker();

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || "http://localhost:8000";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (env.AI_SERVICE_API_KEY) {
      headers["X-API-Key"] = env.AI_SERVICE_API_KEY;
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers,
    });
  }

  private readonly API_PREFIX = "/api/v1";

  async generateClassInsight(payload: unknown): Promise<AIServiceResponse> {
    return this.requestWithRetry(`${this.API_PREFIX}/insights/class`, payload);
  }

  async generateStudentInsight(payload: unknown): Promise<AIServiceResponse> {
    return this.requestWithRetry(`${this.API_PREFIX}/insights/student`, payload);
  }

  async generateSubjectInsight(payload: unknown): Promise<AIServiceResponse> {
    return this.requestWithRetry(`${this.API_PREFIX}/insights/subject`, payload);
  }

  async refreshInsights(payload: unknown): Promise<AIServiceResponse> {
    return this.requestWithRetry(`${this.API_PREFIX}/insights/refresh`, payload);
  }

  async bulkGenerateInsights(payload: unknown): Promise<AIServiceResponse> {
    return this.requestWithRetry(`${this.API_PREFIX}/insights/bulk`, payload);
  }

  // =========================================
  // DELAY (overridable for testing)
  // =========================================
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // =========================================
  // HEALTH CHECK
  // =========================================
  async healthCheck() {
    try {
      const res = await this.client.get(`${this.API_PREFIX}/health`);
      return {
        status: res.status,
        data: res.data,
      };
    } catch {
      throw new ApiError(503, "AI service is unavailable");
    }
  }

  // =========================================
  // REQUEST WITH RETRY + EXPONENTIAL BACKOFF
  // =========================================
  private async requestWithRetry(
    endpoint: string,
    payload: unknown,
    retries = 3
  ): Promise<AIServiceResponse> {
    return this.circuitBreaker.call(async () => {
      let lastError: unknown;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await this.client.post(endpoint, payload);
          return this.normalizeAIResponse(response.data);
        } catch (error: unknown) {
          lastError = error;

          if (this.isRetryable(error) && attempt < retries) {
            const wait = backoffDelay(attempt);
            logger.warn("AI request failed, retrying", {
              endpoint,
              attempt: attempt + 1,
              retries,
              waitMs: Math.round(wait),
            });
            await this.delay(wait);
            continue;
          }

          break;
        }
      }

      return this.handleAIRequestError(lastError);
    });
  }

  // =========================================
  // RETRYABLE CHECK
  // =========================================
  private isRetryable(error: unknown): boolean {
    if (error instanceof AxiosError) {
      if (!error.response) return true;
      const status = error.response.status;
      return status >= 500 || status === 429;
    }
    return true;
  }

  // =========================================
  // NORMALIZE AI RESPONSE
  // =========================================
  private normalizeAIResponse(response: unknown) {
    const validated = validateAIResponse(response);
    return {
      title: validated.title,
      summary: validated.summary,
      data: validated.data,
      confidenceScore: validated.confidenceScore,
      raw: response,
    };
  }

  // =========================================
  // HANDLE AI REQUEST ERRORS
  // =========================================
  private handleAIRequestError(error: unknown): never {
    if (error instanceof ApiError) {
      throw error;
    }

    const err = error as { response?: { status: number; data?: { message?: string } }; code?: string };
    if (err.response) {
      throw new ApiError(
        err.response.status || 500,
        err.response.data?.message || "AI service error"
      );
    }

    if (err.code === "ECONNABORTED") {
      throw new ApiError(504, "AI service timeout");
    }

    throw new ApiError(500, "AI service request failed");
  }
}

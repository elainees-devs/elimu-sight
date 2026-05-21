import axios from "axios";
import { AIService } from "../../ai/ai.service";

jest.setTimeout(15000);

let mockPost: jest.Mock;
let mockGet: jest.Mock;

beforeEach(() => {
  mockPost = jest.fn();
  mockGet = jest.fn();
  jest.spyOn(axios, "create").mockReturnValue({
    post: mockPost,
    get: mockGet,
  } as unknown as ReturnType<typeof axios.create>);
  process.env.AI_SERVICE_URL = "http://test-ai:8000";
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("AIService", () => {
  let service: AIService;

  beforeEach(() => {
    service = new AIService();
  });

  describe("generateClassInsight", () => {
    it("returns normalized response on success", async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          title: "Class Performance Analysis",
          summary: "Good progress",
          data: { avgScore: 85 },
          confidenceScore: 90,
        },
      });

      const result = await service.generateClassInsight({ classId: "c1" });

      expect(result.title).toBe("Class Performance Analysis");
      expect(result.summary).toBe("Good progress");
      expect(result.confidenceScore).toBe(90);
    });

    it("uses fallback values when response has missing fields", async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const result = await service.generateClassInsight({ classId: "c1" });

      expect(result.title).toBe("AI Insight");
      expect(result.summary).toBe("");
      expect(result.confidenceScore).toBe(50);
    });

    it("retries on server error then throws", async () => {
      // @ts-expect-error: accessing private method for mocking delay
      jest.spyOn(AIService.prototype, "delay").mockResolvedValue(undefined);

      mockPost.mockRejectedValue({
        response: { status: 500, data: { message: "Server error" } },
      });

      await expect(service.generateClassInsight({ classId: "c1" })).rejects.toThrow(
        "Server error"
      );

      expect(mockPost).toHaveBeenCalledTimes(4);
    });
  });

  describe("healthCheck", () => {
    it("returns health status when AI service is up", async () => {
      mockGet.mockResolvedValueOnce({ status: 200, data: { status: "healthy" } });

      const result = await service.healthCheck();
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ status: "healthy" });
    });

    it("throws 503 when AI service is down", async () => {
      mockGet.mockRejectedValueOnce(new Error("Connection refused"));

      await expect(service.healthCheck()).rejects.toThrow("AI service is unavailable");
    });
  });
});

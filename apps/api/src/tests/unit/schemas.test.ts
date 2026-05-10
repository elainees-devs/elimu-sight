import {
  generateClassInsightSchema,
  generateStudentInsightSchema,
  generateSubjectInsightSchema,
  refreshInsightSchema,
  bulkGenerateInsightsSchema,
  schoolIdParamSchema,
} from "../../schemas/ai.schema";

describe("AI Schemas", () => {
  describe("generateClassInsightSchema", () => {
    it("passes with valid classId and schoolId", () => {
      const { error } = generateClassInsightSchema.validate({
        classId: "550e8400-e29b-41d4-a716-446655440000",
        schoolId: "550e8400-e29b-41d4-a716-446655440001",
      });
      expect(error).toBeUndefined();
    });

    it("fails when classId is missing", () => {
      const { error } = generateClassInsightSchema.validate({
        schoolId: "550e8400-e29b-41d4-a716-446655440001",
      });
      expect(error).toBeDefined();
    });
  });

  describe("bulkGenerateInsightsSchema", () => {
    it("passes with schoolId and studentIds", () => {
      const { error } = bulkGenerateInsightsSchema.validate({
        schoolId: "550e8400-e29b-41d4-a716-446655440000",
        studentIds: ["550e8400-e29b-41d4-a716-446655440001"],
      });
      expect(error).toBeUndefined();
    });

    it("fails when no ID arrays provided", () => {
      const { error } = bulkGenerateInsightsSchema.validate({
        schoolId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(error).toBeDefined();
    });

    it("passes with classIds and subjectIds", () => {
      const { error } = bulkGenerateInsightsSchema.validate({
        schoolId: "550e8400-e29b-41d4-a716-446655440000",
        classIds: ["550e8400-e29b-41d4-a716-446655440001"],
        subjectIds: ["550e8400-e29b-41d4-a716-446655440002"],
      });
      expect(error).toBeUndefined();
    });
  });

  describe("schoolIdParamSchema", () => {
    it("passes with valid UUID", () => {
      const { error } = schoolIdParamSchema.validate({
        schoolId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(error).toBeUndefined();
    });
  });

  describe("refreshInsightSchema", () => {
    it("passes with valid insightId", () => {
      const { error } = refreshInsightSchema.validate({
        insightId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(error).toBeUndefined();
    });

    it("fails with missing insightId", () => {
      const { error } = refreshInsightSchema.validate({});
      expect(error).toBeDefined();
    });
  });
});

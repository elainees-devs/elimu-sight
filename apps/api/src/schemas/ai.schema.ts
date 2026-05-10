import Joi from "joi";

const uuid = Joi.string().uuid();

export const generateClassInsightSchema = Joi.object({
  classId: uuid.required(),
  schoolId: uuid.required(),
}).options({ presence: "required" });

export const generateStudentInsightSchema = Joi.object({
  studentId: uuid.required(),
  schoolId: uuid.required(),
}).options({ presence: "required" });

export const generateSubjectInsightSchema = Joi.object({
  subjectId: uuid.required(),
  schoolId: uuid.required(),
}).options({ presence: "required" });

export const refreshInsightSchema = Joi.object({
  insightId: uuid.required(),
}).options({ presence: "required" });

export const bulkGenerateInsightsSchema = Joi.object({
  schoolId: uuid.required(),
  studentIds: Joi.array().items(uuid).min(1).optional(),
  classIds: Joi.array().items(uuid).min(1).optional(),
  subjectIds: Joi.array().items(uuid).min(1).optional(),
}).custom((value, helpers) => {
  if (!value.studentIds?.length && !value.classIds?.length && !value.subjectIds?.length) {
    return helpers.error("any.custom", {
      message: "At least one of studentIds, classIds, or subjectIds must be provided",
    });
  }
  return value;
});

export const schoolIdParamSchema = Joi.object({
  schoolId: uuid.required(),
});

type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type GenerateClassInsightInput = InferSchema<typeof generateClassInsightSchema>;
export type GenerateStudentInsightInput = InferSchema<typeof generateStudentInsightSchema>;
export type GenerateSubjectInsightInput = InferSchema<typeof generateSubjectInsightSchema>;
export type RefreshInsightInput = InferSchema<typeof refreshInsightSchema>;
export type BulkGenerateInsightsInput = InferSchema<typeof bulkGenerateInsightsSchema>;
export type SchoolIdParam = InferSchema<typeof schoolIdParamSchema>;

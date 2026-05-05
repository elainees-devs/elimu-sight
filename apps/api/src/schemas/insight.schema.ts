import { generatedBy, insightTypes } from "@utils/index";
import Joi from "joi";

/**
 * =========================
 * Base schema
 * =========================
 */
const insightBase = {
  schoolId: Joi.string().uuid(),
  classId: Joi.string().uuid(),
  studentId: Joi.string().uuid(),
  subjectId: Joi.string().uuid(),

  type: Joi.string().valid(...insightTypes),
  title: Joi.string().max(255),
  summary: Joi.string(),

  data: Joi.object().unknown(true), // allows flexible AI JSON output

  confidenceScore: Joi.number().min(0).max(100),

  generatedBy: Joi.string().valid(...generatedBy),
  period: Joi.string().max(50),
};

/**
 * =========================
 * FULL INSIGHT SCHEMA
 * (DB / response use)
 * =========================
 */
export const insightSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...insightBase,
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE INSIGHT SCHEMA
 * =========================
 * Used by AI system or backend generator
 */
export const createInsightSchema = Joi.object({
  schoolId: insightBase.schoolId.required(),
  classId: insightBase.classId.optional(),
  studentId: insightBase.studentId.optional(),
  subjectId: insightBase.subjectId.optional(),

  type: insightBase.type.required(),
  title: insightBase.title.required(),
  summary: insightBase.summary.optional(),

  data: insightBase.data.optional(),

  confidenceScore: insightBase.confidenceScore.optional(),
  generatedBy: insightBase.generatedBy.required(),
  period: insightBase.period.optional(),
});

/**
 * =========================
 * UPDATE INSIGHT SCHEMA
 * =========================
 * Partial updates (e.g. AI enrichment)
 */
export const updateInsightSchema = Joi.object({
  title: insightBase.title.optional(),
  summary: insightBase.summary.optional(),
  data: insightBase.data.optional(),
  confidenceScore: insightBase.confidenceScore.optional(),
  period: insightBase.period.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 * GET /insights/:id
 * DELETE /insights/:id
 */
export const insightIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
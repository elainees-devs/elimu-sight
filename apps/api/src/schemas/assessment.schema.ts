import { examTypes } from "@utils/index";
import Joi from "joi";

/**
 * =========================
 * Base schema
 * =========================
 */
const assessmentBase = {
  schoolId: Joi.string().uuid(),
  classId: Joi.string().uuid(),
  studentId: Joi.string().uuid(),
  subjectId: Joi.string().uuid(),
  createdBy: Joi.string().uuid(),

  term: Joi.string().max(50),
  examType: Joi.string().valid(...examTypes),

  score: Joi.number().min(0).max(100),
  totalMarks: Joi.number().min(0).max(100),

  grade: Joi.string().max(5),
  remarks: Joi.string(),
};

/**
 * =========================
 * FULL ASSESSMENT SCHEMA
 * =========================
 */
export const assessmentSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...assessmentBase,
  createdAt: Joi.date().required(),
});

/**
 * =========================
 * CREATE ASSESSMENT SCHEMA
 * =========================
 */
export const createAssessmentSchema = Joi.object({
  schoolId: assessmentBase.schoolId.required(),
  classId: assessmentBase.classId.required(),
  studentId: assessmentBase.studentId.required(),
  subjectId: assessmentBase.subjectId.required(),
  createdBy: assessmentBase.createdBy.required(),

  term: assessmentBase.term.required(),
  examType: assessmentBase.examType.required(),

  score: assessmentBase.score.required(),
  totalMarks: assessmentBase.totalMarks.required(),

  grade: assessmentBase.grade.optional(),
  remarks: assessmentBase.remarks.optional(),
});

/**
 * =========================
 * UPDATE ASSESSMENT SCHEMA
 * =========================
 * - partial updates allowed
 * - at least one field required
 */
export const updateAssessmentSchema = Joi.object({
  term: assessmentBase.term.optional(),
  examType: assessmentBase.examType.optional(),
  score: assessmentBase.score.optional(),
  totalMarks: assessmentBase.totalMarks.optional(),
  grade: assessmentBase.grade.optional(),
  remarks: assessmentBase.remarks.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 */
export const assessmentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type Assessment = InferSchema<typeof assessmentSchema>;
export type CreateAssessmentInput = InferSchema<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = InferSchema<typeof updateAssessmentSchema>;
export type AssessmentIdParam = InferSchema<typeof assessmentIdParamSchema>;

import { examTypes } from "@utils/index";
import Joi from "joi";

/**
 * =========================
 * Base schema
 * =========================
 */
const assessmentBase = {
  schoolId: Joi.string().uuid().required(),
  classId: Joi.string().uuid().required(),
  studentId: Joi.string().uuid().required(),
  subjectId: Joi.string().uuid().required(),
  createdBy: Joi.string().uuid().required(),

  term: Joi.string().trim().max(50),
  examType: Joi.string()
    .valid(...examTypes)
    .required(),

  score: Joi.number().min(0).max(100).required(),
  totalMarks: Joi.number().min(0).max(100).required(),

  grade: Joi.string().trim().max(5),
  remarks: Joi.string().trim().allow("").optional(),
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
}).options({
  stripUnknown: true,
});

/**
 * =========================
 * CREATE ASSESSMENT SCHEMA
 * =========================
 */
export const createAssessmentSchema = Joi.object({
  schoolId: assessmentBase.schoolId,
  classId: assessmentBase.classId,
  studentId: assessmentBase.studentId,
  subjectId: assessmentBase.subjectId,
  createdBy: assessmentBase.createdBy,

  term: assessmentBase.term.required(),
  examType: assessmentBase.examType,

  score: assessmentBase.score,
  totalMarks: assessmentBase.totalMarks,

  grade: assessmentBase.grade.optional(),
  remarks: assessmentBase.remarks.optional(),
}).options({
  stripUnknown: true,
});

/**
 * =========================
 * UPDATE ASSESSMENT SCHEMA
 * =========================
 * - partial updates allowed
 * - at least one field required
 */
export const updateAssessmentSchema = Joi.object({
  term: assessmentBase.term,
  examType: Joi.string().valid(...examTypes),

  score: assessmentBase.score,
  totalMarks: assessmentBase.totalMarks,

  grade: assessmentBase.grade,
  remarks: assessmentBase.remarks,
})
  .min(1)
  .options({
    stripUnknown: true,
  });

/**
 * =========================
 * PARAM SCHEMAS
 * =========================
 */
export const assessmentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
}).options({
  stripUnknown: true,
});

export const assessmentSchoolAndIdParamSchema = Joi.object({
  schoolId: Joi.string().uuid().required(),
  id: Joi.string().uuid().required(),
}).options({ stripUnknown: true });

/**
 * =========================
 * TYPES
 * =========================
 */
export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;

export type Assessment = InferSchema<typeof assessmentSchema>;
export type CreateAssessmentInput = InferSchema<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = InferSchema<typeof updateAssessmentSchema>;
export type AssessmentIdParam = InferSchema<typeof assessmentIdParamSchema>;
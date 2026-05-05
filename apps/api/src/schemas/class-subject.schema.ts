import Joi from "joi";

/**
 * =========================
 * Base schema
 * =========================
 */
const classSubjectBase = {
  classId: Joi.string().uuid(),
  subjectId: Joi.string().uuid(),
  teacherId: Joi.string().uuid(),
};

/**
 * =========================
 * FULL CLASS_SUBJECT SCHEMA
 * =========================
 */
export const classSubjectSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...classSubjectBase,
  classId: classSubjectBase.classId.required(),
  subjectId: classSubjectBase.subjectId.required(),
  createdAt: Joi.date().required(),
});

/**
 * =========================
 * CREATE CLASS_SUBJECT SCHEMA
 * =========================
 * Assign subject to class + teacher
 */
export const createClassSubjectSchema = Joi.object({
  classId: classSubjectBase.classId.required(),
  subjectId: classSubjectBase.subjectId.required(),
  teacherId: classSubjectBase.teacherId.optional(),
});

/**
 * =========================
 * UPDATE CLASS_SUBJECT SCHEMA
 * =========================
 * (e.g. reassign teacher)
 */
export const updateClassSubjectSchema = Joi.object({
  teacherId: classSubjectBase.teacherId.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 */
export const classSubjectIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type ClassSubject = InferSchema<typeof classSubjectSchema>;
export type CreateClassSubjectInput = InferSchema<typeof createClassSubjectSchema>;
export type UpdateClassSubjectInput = InferSchema<typeof updateClassSubjectSchema>;
export type ClassSubjectIdParam = InferSchema<typeof classSubjectIdParamSchema>;
import Joi from "joi";

/**
 * =========================
 * Base schema
 * =========================
 */
const subjectBase = {
  schoolId: Joi.string().uuid(),

  name: Joi.string().min(2).max(255),
  code: Joi.string().max(50),
  description: Joi.string(),
};

/**
 * =========================
 * FULL SUBJECT SCHEMA
 * =========================
 */
export const subjectSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...subjectBase,
  name: subjectBase.name.required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE SUBJECT SCHEMA
 * =========================
 */
export const createSubjectSchema = Joi.object({
  schoolId: subjectBase.schoolId.required(),
  name: subjectBase.name.required(),
  code: subjectBase.code.optional(),
  description: subjectBase.description.optional(),
});

/**
 * =========================
 * UPDATE SUBJECT SCHEMA
 * =========================
 * - partial update allowed
 * - at least one field required
 */
export const updateSubjectSchema = Joi.object({
  name: subjectBase.name.optional(),
  code: subjectBase.code.optional(),
  description: subjectBase.description.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 * GET /subjects/:id
 * DELETE /subjects/:id
 */
export const subjectIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type Subject = InferSchema<typeof subjectSchema>;
export type CreateSubjectInput = InferSchema<typeof createSubjectSchema>;
export type UpdateSubjectInput = InferSchema<typeof updateSubjectSchema>;
export type SubjectIdParam = InferSchema<typeof subjectIdParamSchema>;
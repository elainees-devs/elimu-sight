import Joi from "joi";

/**
 * =========================
 * Base reusable schema
 * =========================
 */
const classBase = {
  name: Joi.string().max(100),
  level: Joi.string().max(50),
  stream: Joi.string().max(50),
  academicYear: Joi.string().max(20),
  schoolId: Joi.string().uuid(),
  classTeacherId: Joi.string().uuid(),
};

/**
 * =========================
 * FULL CLASS SCHEMA
 * (DB response / internal use)
 * =========================
 */
export const classSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...classBase,
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE CLASS SCHEMA
 * =========================
 */
export const createClassSchema = Joi.object({
  name: classBase.name.required(),
  level: classBase.level.required(),
  stream: classBase.stream.required(),
  academicYear: classBase.academicYear.required(),
  schoolId: classBase.schoolId.required(),
  classTeacherId: classBase.classTeacherId.optional(),
});

/**
 * =========================
 * UPDATE CLASS SCHEMA
 * =========================
 * - all fields optional
 * - but at least one must be provided
 */
export const updateClassSchema = Joi.object({
  name: classBase.name.optional(),
  level: classBase.level.optional(),
  stream: classBase.stream.optional(),
  academicYear: classBase.academicYear.optional(),
  classTeacherId: classBase.classTeacherId.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 * GET /classes/:id
 * DELETE /classes/:id
 */
export const classIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
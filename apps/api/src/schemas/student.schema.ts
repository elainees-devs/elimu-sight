import { genders } from "@utils/index";
import Joi from "joi";


/**
 * =========================
 * Base schema
 * =========================
 */
const studentBase = {
  schoolId: Joi.string().uuid(),
  classId: Joi.string().uuid(),

  admissionNumber: Joi.string().max(100),
  fullName: Joi.string().min(3).max(255),

  gender: Joi.string().valid(...genders),

  dateOfBirth: Joi.date(),

  guardianName: Joi.string().max(255),
  guardianPhone: Joi.string().max(50),

  isActive: Joi.boolean(),
};

/**
 * =========================
 * FULL STUDENT SCHEMA
 * =========================
 */
export const studentSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...studentBase,
  fullName: studentBase.fullName.required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE STUDENT SCHEMA
 * =========================
 */
export const createStudentSchema = Joi.object({
  schoolId: studentBase.schoolId.required(),
  classId: studentBase.classId.required(),

  admissionNumber: studentBase.admissionNumber.optional(),
  fullName: studentBase.fullName.required(),
  gender: studentBase.gender.optional(),
  dateOfBirth: studentBase.dateOfBirth.optional(),

  guardianName: studentBase.guardianName.optional(),
  guardianPhone: studentBase.guardianPhone.optional(),
});

/**
 * =========================
 * UPDATE STUDENT SCHEMA
 * =========================
 * - partial updates allowed
 * - must send at least 1 field
 */
export const updateStudentSchema = Joi.object({
  admissionNumber: studentBase.admissionNumber.optional(),
  fullName: studentBase.fullName.optional(),
  gender: studentBase.gender.optional(),
  dateOfBirth: studentBase.dateOfBirth.optional(),
  guardianName: studentBase.guardianName.optional(),
  guardianPhone: studentBase.guardianPhone.optional(),
  classId: studentBase.classId.optional(),
  isActive: studentBase.isActive.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA
 * =========================
 * GET /students/:id
 * DELETE /students/:id
 */
export const studentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type Student = InferSchema<typeof studentSchema>;
export type CreateStudentInput = InferSchema<typeof createStudentSchema>;
export type UpdateStudentInput = InferSchema<typeof updateStudentSchema>;
export type StudentIdParam = InferSchema<typeof studentIdParamSchema>;
import { subscriptionPlans } from "@utils/index";
import Joi, { ObjectSchema } from "joi";

/**
 * =========================
 * Base reusable schema parts
 * =========================
 */
const schoolBase = {
  name: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  phone: Joi.string().max(50),
  address: Joi.string(),
  subscriptionPlan: Joi.string().valid(...subscriptionPlans),
  isActive: Joi.boolean(),
};

/**
 * =========================
 * FULL SCHOOL SCHEMA
 * (used for responses / internal validation)
 * =========================
 */
export const schoolSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...schoolBase,
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE SCHOOL SCHEMA
 * (POST /schools)
 * =========================
 */
export const createSchoolSchema = Joi.object({
  name: schoolBase.name.required(),
  email: schoolBase.email.required(),
  phone: schoolBase.phone.required(),
  address: schoolBase.address.required(),
  subscriptionPlan: schoolBase.subscriptionPlan.required(),
});

/**
 * =========================
 * UPDATE SCHOOL SCHEMA
 * (PATCH /schools/:id)
 * =========================
 * - all fields optional
 * - but at least one must be provided
 */
export const updateSchoolSchema = Joi.object({
  name: schoolBase.name.optional(),
  email: schoolBase.email.optional(),
  phone: schoolBase.phone.optional(),
  address: schoolBase.address.optional(),
  subscriptionPlan: schoolBase.subscriptionPlan.optional(),
  isActive: schoolBase.isActive.optional(),
}).min(1);

/**
 * =========================
 * PARAM SCHEMA (reusable)
 * =========================
 * Use for routes like:
 * GET /schools/:id
 * DELETE /schools/:id
 */
export const schoolIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * Utility to extract Joi type
 */
export type InferSchema<T> = T extends ObjectSchema<infer U> ? U : never;
export type School = InferSchema<typeof schoolSchema>;
export type CreateSchoolInput = InferSchema<typeof createSchoolSchema>;
export type UpdateSchoolInput = InferSchema<typeof updateSchoolSchema>;
export type SchoolIdParam = InferSchema<typeof schoolIdParamSchema>;

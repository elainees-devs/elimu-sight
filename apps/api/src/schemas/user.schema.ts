import { Roles } from "@utils/constants";
import Joi from "joi";

/**
 * =========================
 * Base reusable schema
 * =========================
 */
const userBase = {
  fullName: Joi.string().min(3).max(255),
  email: Joi.string().email(),
  role: Joi.string().valid(...Roles),
  schoolId: Joi.string().uuid(),
  isActive: Joi.boolean(),
};

/**
 * =========================
 * FULL USER SCHEMA
 * (response/internal use)
 * =========================
 */
export const userSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ...userBase,
  isActive: Joi.boolean().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().optional(),
});

/**
 * =========================
 * CREATE USER SCHEMA
 * (POST /users)
 * =========================
 */
export const createUserSchema = Joi.object({
  fullName: userBase.fullName.required(),
  email: userBase.email.required(),
  role: userBase.role.required(),
  schoolId: userBase.schoolId.required(),
  password: Joi.string().min(6).max(255).required(),
});

/**
 * =========================
 * UPDATE USER SCHEMA
 * (PATCH /users/:id)
 * =========================
 * - all optional
 * - at least one field required
 */
export const updateUserSchema = Joi.object({
  fullName: userBase.fullName.optional(),
  email: userBase.email.optional(),
  role: userBase.role.optional(),
  isActive: userBase.isActive.optional(),
  updatedAt: Joi.date().optional(),
}).min(1);


/**
 * =========================
 * AUTHENTICATION SCHEMA
 * (LOGIN)
 * =========================
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
});

/**
 * =========================
 * PARAM SCHEMA (reusable)
 * =========================
 * GET /users/:id
 * DELETE /users/:id
 */
export const userIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export type InferSchema<T> = T extends Joi.ObjectSchema<infer U> ? U : never;
export type User = InferSchema<typeof userSchema>;
export type CreateUserInput = InferSchema<typeof createUserSchema>;
export type UpdateUserInput = InferSchema<typeof updateUserSchema>;
export type AuthenticateUserInput = InferSchema<typeof loginSchema>;
export type UserIdParam = InferSchema<typeof userIdParamSchema>;

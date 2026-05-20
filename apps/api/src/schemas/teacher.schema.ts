import Joi from "joi";

export const teacherIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const updateTeacherSchema = Joi.object({
  fullName: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
}).min(1);

export const assignClassSchema = Joi.object({
  classId: Joi.string().uuid().required(),
});

export type TeacherIdParam = { id: string };
export type UpdateTeacherInput = { fullName?: string; email?: string };
export type AssignClassInput = { classId: string };

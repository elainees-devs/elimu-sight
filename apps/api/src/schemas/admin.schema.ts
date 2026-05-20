import { subscriptionPlans } from "@utils/index";
import Joi from "joi";

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("", null),
  sortBy: Joi.string(),
  sortOrder: Joi.string().valid("asc", "desc"),
});

export const adminCreateSchoolSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(50).required(),
  address: Joi.string().allow("", null),
  subscriptionPlan: Joi.string()
    .valid(...subscriptionPlans)
    .required(),
});

export const adminUpdateSchoolSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  phone: Joi.string().max(50),
  address: Joi.string().allow("", null),
  subscriptionPlan: Joi.string().valid(...subscriptionPlans),
  isActive: Joi.boolean(),
}).min(1);

export const adminCreateUserSchema = Joi.object({
  schoolId: Joi.string().uuid().required(),
  fullName: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string()
    .valid("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT")
    .required(),
  assignedClassId: Joi.string().uuid().allow(null),
});

export const adminUpdateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  role: Joi.string().valid("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT"),
  schoolId: Joi.string().uuid(),
  isActive: Joi.boolean(),
  assignedClassId: Joi.string().uuid().allow(null),
}).min(1);

export const schoolIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const userIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const auditLogFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  action: Joi.string().allow("", null),
  resource: Joi.string().allow("", null),
  userId: Joi.string().uuid().allow("", null),
  schoolId: Joi.string().uuid().allow("", null),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  body: Joi.string().min(1).required(),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH", "URGENT")
    .required(),
  status: Joi.string().valid("DRAFT", "PUBLISHED").default("DRAFT"),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  body: Joi.string().min(1),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT"),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED"),
}).min(1);

export const announcementIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const updateTicketSchema = Joi.object({
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT"),
  assignedTo: Joi.string().uuid().allow(null),
}).min(1);

export const ticketIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const changePlanSchema = Joi.object({
  plan: Joi.string()
    .valid(...subscriptionPlans)
    .required(),
});

export const announcementFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").allow("", null),
});

export const ticketFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED").allow("", null),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").allow("", null),
});

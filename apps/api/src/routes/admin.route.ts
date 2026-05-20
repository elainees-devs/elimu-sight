import { Router } from "express";
import { AdminController } from "@controllers/index";
import { validate, authenticateMiddleware, authorize } from "@middlewares/index";
import {
  adminCreateSchoolSchema,
  adminUpdateSchoolSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
  schoolIdParamSchema,
  userIdParamSchema,
  auditLogFilterSchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementIdParamSchema,
  updateTicketSchema,
  ticketIdParamSchema,
  changePlanSchema,
  announcementFilterSchema,
  ticketFilterSchema,
} from "../schemas/admin.schema";

const router = Router();
const adminController = new AdminController();

const auth = [authenticateMiddleware, authorize("SUPER_ADMIN")];

// =========================
// OVERVIEW & HEALTH
// =========================
router.get("/overview", ...auth, (req, res, next) =>
  adminController.getOverview(req, res, next)
);

router.get("/health", ...auth, (req, res, next) =>
  adminController.getHealth(req, res, next)
);

// =========================
// SCHOOLS (TENANTS)
// =========================
router.get("/schools", ...auth, (req, res, next) =>
  adminController.getSchools(req, res, next)
);

router.get("/schools/:id", ...auth, validate(schoolIdParamSchema, "params"), (req, res, next) =>
  adminController.getSchoolDetail(req, res, next)
);

router.post(
  "/schools",
  ...auth,
  validate(adminCreateSchoolSchema, "body"),
  (req, res, next) => adminController.createSchool(req, res, next)
);

router.patch(
  "/schools/:id",
  ...auth,
  validate(schoolIdParamSchema, "params"),
  validate(adminUpdateSchoolSchema, "body"),
  (req, res, next) => adminController.updateSchool(req, res, next)
);

router.delete(
  "/schools/:id",
  ...auth,
  validate(schoolIdParamSchema, "params"),
  (req, res, next) => adminController.deleteSchool(req, res, next)
);

// =========================
// USERS
// =========================
router.get("/users", ...auth, (req, res, next) =>
  adminController.getUsers(req, res, next)
);

router.get("/users/:id", ...auth, validate(userIdParamSchema, "params"), (req, res, next) =>
  adminController.getUserDetail(req, res, next)
);

router.post(
  "/users",
  ...auth,
  validate(adminCreateUserSchema, "body"),
  (req, res, next) => adminController.createUser(req, res, next)
);

router.patch(
  "/users/:id",
  ...auth,
  validate(userIdParamSchema, "params"),
  validate(adminUpdateUserSchema, "body"),
  (req, res, next) => adminController.updateUser(req, res, next)
);

router.delete(
  "/users/:id",
  ...auth,
  validate(userIdParamSchema, "params"),
  (req, res, next) => adminController.deactivateUser(req, res, next)
);

// =========================
// AI ANALYTICS
// =========================
router.get("/analytics/ai-usage", ...auth, (req, res, next) =>
  adminController.getAIUsage(req, res, next)
);

router.get("/analytics/ai-usage/trends", ...auth, (req, res, next) =>
  adminController.getAIUsageTrends(req, res, next)
);

router.get("/analytics/insights", ...auth, (req, res, next) =>
  adminController.getInsightStats(req, res, next)
);

// =========================
// AUDIT LOGS & SECURITY
// =========================
router.get("/audit-logs", ...auth, validate(auditLogFilterSchema, "query"), (req, res, next) =>
  adminController.getAuditLogs(req, res, next)
);

router.get("/audit-logs/stats", ...auth, (req, res, next) =>
  adminController.getAuditLogStats(req, res, next)
);

router.get("/security/overview", ...auth, (req, res, next) =>
  adminController.getSecurityOverview(req, res, next)
);

// =========================
// BILLING
// =========================
router.get("/billing/overview", ...auth, (req, res, next) =>
  adminController.getBillingOverview(req, res, next)
);

router.patch(
  "/billing/schools/:id/plan",
  ...auth,
  validate(schoolIdParamSchema, "params"),
  validate(changePlanSchema, "body"),
  (req, res, next) => adminController.changeSchoolPlan(req, res, next)
);

// =========================
// ANNOUNCEMENTS
// =========================
router.get("/announcements", ...auth, validate(announcementFilterSchema, "query"), (req, res, next) =>
  adminController.getAnnouncements(req, res, next)
);

router.post(
  "/announcements",
  ...auth,
  validate(createAnnouncementSchema, "body"),
  (req, res, next) => adminController.createAnnouncement(req, res, next)
);

router.patch(
  "/announcements/:id",
  ...auth,
  validate(announcementIdParamSchema, "params"),
  validate(updateAnnouncementSchema, "body"),
  (req, res, next) => adminController.updateAnnouncement(req, res, next)
);

router.delete(
  "/announcements/:id",
  ...auth,
  validate(announcementIdParamSchema, "params"),
  (req, res, next) => adminController.deleteAnnouncement(req, res, next)
);

// =========================
// SUPPORT TICKETS
// =========================
router.get("/support-tickets", ...auth, validate(ticketFilterSchema, "query"), (req, res, next) =>
  adminController.getSupportTickets(req, res, next)
);

router.get(
  "/support-tickets/:id",
  ...auth,
  validate(ticketIdParamSchema, "params"),
  (req, res, next) => adminController.getSupportTicketDetail(req, res, next)
);

router.patch(
  "/support-tickets/:id",
  ...auth,
  validate(ticketIdParamSchema, "params"),
  validate(updateTicketSchema, "body"),
  (req, res, next) => adminController.updateSupportTicket(req, res, next)
);

export default router;

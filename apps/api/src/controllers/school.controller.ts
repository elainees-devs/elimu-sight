import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { SchoolService } from "../services/index";
import { toSchoolId } from "../mappers";
import { SchoolIdParam } from "../schemas";
import { logAudit } from "@utils/index";

const schoolService = new SchoolService();

export class SchoolController {
  // ===================================
  // GET ALL SCHOOLS
  // ===================================
  async getAllSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await schoolService.getAllSchools({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as "name" | "created_at" | undefined,
        sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
        search: req.query.search ? String(req.query.search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Schools fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET SCHOOL BY ID
  // ===================================
  async getSchoolById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toSchoolId({
        id: req.params.id,
      } as SchoolIdParam);

      const result = await schoolService.getSchoolById({ id });

      return res.status(200).json({
        success: true,
        message: "School fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET SCHOOL BY EMAIL
  // ===================================
  async getSchoolByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params as { email: string };

      const school = await schoolService.getSchoolByEmail(email);

      return res.status(200).json({
        success: true,
        message: "School fetched successfully",
        data: school,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE SCHOOL
  // ===================================
  async createSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const school = await schoolService.createSchool(req.body);
      await logAudit({
        action: "SCHOOL_CREATED",
        resource: "schools",
        resourceId: school.id,
        schoolId: school.id,
        userId: req.user?.id,
        details: { name: req.body.name, email: req.body.email },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(201).json({
        success: true,
        message: "School created successfully",
        data: school,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // UPDATE SCHOOL
  // ===================================
  async updateSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: req.params.id,
      };

      const school = await schoolService.updateSchool(input);
      await logAudit({
        action: "SCHOOL_UPDATED",
        resource: "schools",
        resourceId: school.id,
        schoolId: school.id,
        userId: req.user?.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(200).json({
        success: true,
        message: "School updated successfully",
        data: school,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE SCHOOL
  // ===================================
  async deleteSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = toSchoolId({
        id: req.params.id,
      } as SchoolIdParam);

      const school = await schoolService.deleteSchool({ id });
      await logAudit({
        action: "SCHOOL_DELETED",
        resource: "schools",
        resourceId: school.id,
        schoolId: school.id,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(200).json({
        success: true,
        message: "School deleted successfully",
        data: school,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET SCHOOL COUNT
  // ===================================
  async getSchoolCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await schoolService.getSchoolCount();

      return res.status(200).json({
        success: true,
        message: "School count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }
}
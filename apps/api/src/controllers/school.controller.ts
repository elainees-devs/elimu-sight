import { Request, Response, NextFunction } from "express";
import { SchoolService } from "@services/index";
import { toEmailParam, toIdParam } from "@utils/index";

const schoolService = new SchoolService();

// ===============================
// ALLOWED SORT FIELDS (TYPE SAFE)
// ===============================
const allowedSortBy = ["name", "created_at"] as const;
type SortBy = (typeof allowedSortBy)[number];

export class SchoolController {
  // ===============================
  // GET ALL SCHOOLS
  // ===============================
  async getAllSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sortBy: sortByRaw, sortOrder, search } = req.query;

      const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
        ? (sortByRaw as SortBy)
        : "created_at";

      const result = await schoolService.getAllSchools({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: search ? String(search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Schools fetched successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // GET SCHOOL BY EMAIL
  // ===============================
  async getSchoolByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = toEmailParam(req);

      const school = await schoolService.getSchoolByEmail(email);

      res.status(200).json({
        success: true,
        message: "School fetched successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // CREATE SCHOOL
  // ===============================
  async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const school = await schoolService.createSchool(req.body);

      res.status(201).json({
        success: true,
        message: "School created successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // UPDATE SCHOOL
  // ===============================
  async updateSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: Number(req.params.id),
      };

      const school = await schoolService.updateSchool(input);

      res.status(200).json({
        success: true,
        message: "School updated successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // DELETE SCHOOL
  // ===============================
  async deleteSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const school = await schoolService.deleteSchool(toIdParam(req));

      res.status(200).json({
        success: true,
        message: "School deleted successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // GET SCHOOL COUNT
  // ===============================
  async getSchoolCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await schoolService.getSchoolCount();

      res.status(200).json({
        success: true,
        message: "School count fetched successfully",
        data: {
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

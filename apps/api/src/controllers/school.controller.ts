import { Request, Response, NextFunction } from "express";
import { SchoolService } from "@services/index";

const schoolService = new SchoolService();

// ===============================
// ALLOWED SORT FIELDS (TYPE SAFE)
// ===============================
const allowedSortBy = ["name", "created_at"] as const;
type SortBy = (typeof allowedSortBy)[number];

export class SchoolController {
  // ===============================
  // GET ALL SCHOOLS LOGIC
  // ===============================
  async getAllSchools(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT QUERY PARAMS
      // =========================
      const { page, limit, sortBy: sortByRaw, sortOrder, search } = req.query;

      // =========================
      // TYPE-SAFE SORT BY
      // =========================
      const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
        ? (sortByRaw as SortBy)
        : "created_at";

      // =========================
      // CALL SERVICE
      // =========================
      const result = await schoolService.getAllSchools({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: search ? String(search) : undefined,
      });

      // =========================
      // RESPONSE
      // =========================
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

  // ===========================
  // GET SCHOOL BY EMAIL LOGIC
  // ===========================
  async getSchoolByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT EMAIL PARAM
      // =========================
      const { email } = req.params as { email: string };

      // =========================
      // FETCH SCHOOL BY EMAIL
      // =========================
      const school = await schoolService.getSchoolByEmail(email);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "School fetched successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // CREATE NEW SCHOOL LOGIC
  // =========================
  async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT REQUEST BODY
      // =========================
      const input = req.body;

      // =========================
      // CREATE SCHOOL
      // =========================
      const school = await schoolService.createSchool(input);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(201).json({
        success: true,
        message: "School created successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===========================
  // UPDATE SCHOOL DETAILS LOGIC
  // ===========================
  async updateSchool(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PARAMS + BODY
      // =========================
      const { id } = req.params;
      const input = {
        ...req.body,
        id: Number(id),
      };

      // =========================
      // UPDATE SCHOOL
      // =========================
      const school = await schoolService.updateSchool(input);

      // =========================
      // SUCCESS RESPONSE
      // =========================
      res.status(200).json({
        success: true,
        message: "School updated successfully",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }
}

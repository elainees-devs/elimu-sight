import { Request, Response, NextFunction } from "express";
import { ClassService } from "@services/class.service";
import { toIdParam, toSchoolIdParam } from "@utils/index";

const classService = new ClassService();

// ===============================
// ALLOWED SORT FIELDS (TYPE SAFE)
// ===============================
const allowedSortBy = ["name", "created_at"] as const;
type SortBy = (typeof allowedSortBy)[number];

export class ClassController {
  // ===============================
  // GET ALL CLASSES
  // ===============================
  async getAllClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);
      const { page, limit, sortBy: sortByRaw, sortOrder, search } = req.query;

      const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
        ? (sortByRaw as SortBy)
        : "created_at";

      const result = await classService.getAllClasses(schoolId, {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: search ? String(search) : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Classes fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // GET CLASS BY ID
  // ===============================
  async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const classData = await classService.getClassById(toIdParam(req));

      res.status(200).json({
        success: true,
        message: "Class fetched successfully",
        data: classData,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // CREATE CLASS
  // ===============================
  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classData = await classService.createClass(req.body);

      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: classData,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // UPDATE CLASS
  // ===============================
  async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: Number(req.params.id),
      };

      const updatedClass = await classService.updateClassDetails(input);

      res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: updatedClass,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // DELETE CLASS
  // ===============================
  async deleteClass(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedClass = await classService.deleteClass(toIdParam(req));

      res.status(200).json({
        success: true,
        message: "Class deleted successfully",
        data: deletedClass,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
  // GET CLASS COUNT
  // ===============================
  async getClassCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const count = await classService.getClassCount(schoolId);

      res.status(200).json({
        success: true,
        message: "Class count fetched successfully",
        data: {
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
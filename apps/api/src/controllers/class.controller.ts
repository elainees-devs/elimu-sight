import { Request, Response, NextFunction } from "express";
import { ClassService } from "@services/index";
import { toClassId, toSchoolId } from "mappers";
import { ClassIdParam, SchoolIdParam } from "schemas";

const classService = new ClassService();

export class ClassController {
  // ===================================
  // GET ALL CLASSES
  // ===================================
  async getAllClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await classService.getAllClasses(schoolId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        search: req.query.search ? String(req.query.search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Classes fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET CLASS BY ID
  // ===================================
  async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toClassId({
        id: req.params.id,
      } as ClassIdParam);

      const result = await classService.getClassById({ id });

      return res.status(200).json({
        success: true,
        message: "Class fetched successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // CREATE CLASS
  // ===================================
  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classData = await classService.createClass(req.body);

      return res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: classData,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // UPDATE CLASS
  // ===================================
  async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: req.params.id,
      };

      const updatedClass = await classService.updateClassDetails(input);

      return res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: updatedClass,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE CLASS
  // ===================================
  async deleteClass(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toClassId({
        id: req.params.id,
      } as ClassIdParam);

      const deletedClass = await classService.deleteClass({ id });

      return res.status(200).json({
        success: true,
        message: "Class deleted successfully",
        data: deletedClass,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET CLASS COUNT
  // ===================================
  async getClassCount(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const count = await classService.getClassCount(schoolId);

      return res.status(200).json({
        success: true,
        message: "Class count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }
}
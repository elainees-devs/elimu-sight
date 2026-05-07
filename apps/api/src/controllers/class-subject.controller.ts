import { Request, Response, NextFunction } from "express";
import { ClassSubjectService } from "@services/index";
import { toClassIdParam, toIdParam } from "@utils/index";

const classSubjectService = new ClassSubjectService();

export const ClassSubjectController = {
  // ===================================
  // GET SUBJECTS BY CLASS
  // ===================================
  async getSubjectsByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = toClassIdParam(req);

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };

      const result = await classSubjectService.getSubjectsByClass(
        classId,
        params
      );

      res.status(200).json({
        success: true,
        message: "Class subjects fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===================================
  // GET CLASS SUBJECT BY ID
  // ===================================
  async getClassSubjectById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await classSubjectService.getClassSubjectById(
        toIdParam(req)
      );

      res.status(200).json({
        success: true,
        message: "Class subject fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

};
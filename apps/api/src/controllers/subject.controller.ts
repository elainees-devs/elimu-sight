import {Request, Response, NextFunction} from "express";
import { SubjectService } from "@services/subject.service";

const subjectService = new SubjectService();
export class SubjectController {
    // ===============================
// GET ALL SUBJECTS
// ===============================
async getAllSubjects(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS
    // =========================
    const { schoolId } = req.params as { schoolId: string };

    const params = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      sortBy: req.query.sortBy as "name" | "created_at",
      sortOrder: req.query.sortOrder as "asc" | "desc",
      search: req.query.search as string,
    };

    // =========================
    // FETCH SUBJECTS
    // =========================
    const result = await subjectService.getAllSubjects(
      schoolId,
      params
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

}
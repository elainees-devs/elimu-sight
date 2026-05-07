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
// ===============================
// GET SUBJECT BY NAME
// ===============================
async getSubjectByName(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS
    // =========================
    const { schoolId, name } = req.params as {
      schoolId: string;
      name: string;
    };

    // =========================
    // FETCH SUBJECT
    // =========================
    const subject = await subjectService.getSubjectByName(
      schoolId,
      name
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      message: "Subject fetched successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
}

// ===============================
// UPDATE SUBJECT DETAILS
// ===============================
async updateSubject(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS + BODY
    // =========================
    const id = Number(req.params.id);

    const input = {
      ...req.body,
      id,
    };

    // =========================
    // UPDATE SUBJECT
    // =========================
    const subject = await subjectService.updateSubjectDetails(input);

    // =========================
    // SUCCESS RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
}

}
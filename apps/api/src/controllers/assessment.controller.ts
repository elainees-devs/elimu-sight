import {Request, Response, NextFunction} from "express";
import {toAssessmentIdParam, toSchoolIdParam} from "utils/index";
import {AssessmentService} from "@services/index";
import { CreateAssessmentInput, UpdateAssessmentInput } from "schemas/index";

const assessmentService = new AssessmentService();


// ===============================
// ALLOWED SORT FIELDS (TYPE SAFE)
// ===============================
const allowedSortBy = ["term", "exam_type", "grade", "created_at"] as const;
type SortBy = (typeof allowedSortBy)[number];

export class AssessmentController {
  // ===============================
  // GET ALL ASSESSMENTS
  // ===============================
  async getAllAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { schoolId } = toSchoolIdParam(req);
      const { page, limit, sortBy: sortByRaw, sortOrder, search } =
        req.query;

      const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
        ? (sortByRaw as SortBy)
        : "created_at";

      const result = await assessmentService.getAllAssessments(
        schoolId,
        {
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10,
          sortBy,
          sortOrder: sortOrder === "asc" ? "asc" : "desc",
          search: search ? String(search) : undefined,
        }
      );

      res.status(200).json({
        success: true,
        message: "Assessments fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===============================
// GET ASSESSMENT BY NAME
// ===============================
async getAssessmentByName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { schoolId } = toSchoolIdParam(req);
    const { examType } = req.params;

    const assessment =
      await assessmentService.getAssessmentByName(
        String(schoolId),
        String(examType)
      );

    return res.status(200).json({
      success: true,
      message: "Assessment fetched successfully",
      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}

// ===============================
// CREATE ASSESSMENT
// ===============================

  async createAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input = req.body as CreateAssessmentInput;

      const assessment =
        await assessmentService.createAssessment(input);

      return res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

// ===============================
// UPDATE ASSESSMENT DETAILS
// ===============================
async updateAssessmentDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = req.body as UpdateAssessmentInput;

    const updatedAssessment =
      await assessmentService.updateAssessmentDetails(input);

    return res.status(200).json({
      success: true,
      message: "Assessment updated successfully",
      data: updatedAssessment,
    });
  } catch (error) {
    return next(error);
  }
}
// ===============================
// SOFT DELETE ASSESSMENT
// ===============================
async deleteAssessment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = toAssessmentIdParam(req);

    const deletedAssessment =
      await assessmentService.deleteAssessment(params);

    return res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
      data: deletedAssessment,
    });
  } catch (error) {
    return next(error);
  }
}

// ===============================
// GET ASSESSMENT COUNT
// ===============================
async getAssessmentCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { schoolId } = toSchoolIdParam(req);

    const count =
      await assessmentService.getAssessmentCount(
        String(schoolId)
      );

    return res.status(200).json({
      success: true,
      message: "Assessment count fetched successfully",
      data: count,
    });
  } catch (error) {
    return next(error);
  }
}

}
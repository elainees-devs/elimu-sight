import {Request, Response, NextFunction} from "express";
import {toIdParam, toSchoolIdParam} from "utils/index";
import {AssessmentService} from "@services/index";

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
}
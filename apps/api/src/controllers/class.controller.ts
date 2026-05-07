import { Request, Response, NextFunction } from "express";
import { ClassService } from "@services/class.service";


const classService = new ClassService();

// ===============================
// ALLOWED SORT FIELDS (TYPE SAFE)
// ===============================
const allowedSortBy = ["name", "created_at"] as const;
type SortBy = (typeof allowedSortBy)[number];

export class ClassController {
// ===============================
// GET ALL CLASSES LOGIC
// ===============================
async getAllClasses(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS + QUERY
    // =========================
    const { schoolId } = req.params as { schoolId: string };

    const { page, limit, sortBy: sortByRaw, sortOrder, search } = req.query;

    // =========================
    // TYPE-SAFE SORT BY
    // =========================
    const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
      ? (sortByRaw as SortBy)
      : "created_at";

    // =========================
    // FETCH CLASSES
    // =========================
    const result = await classService.getAllClasses(
      schoolId,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: search ? String(search) : undefined,
      }
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================
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
// GET CLASS BY ID LOGIC
// ===============================
async getClassById(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS
    // =========================
    const params = {
      id: Number(req.params.id),
    };

    // =========================
    // FETCH CLASS
    // =========================
    const classData = await classService.getClassById(params);

    // =========================
    // SUCCESS RESPONSE
    // =========================
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
// CREATE NEW CLASS LOGIC
// ===============================
async createClass(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT REQUEST BODY
    // =========================
    const input = req.body;

    // =========================
    // CREATE CLASS
    // =========================
    const classData = await classService.createClass(input);

    // =========================
    // SUCCESS RESPONSE
    // =========================
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
// UPDATE CLASS DETAILS
// ===============================
async updateClass(req: Request, res: Response, next: NextFunction) {
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
    // UPDATE CLASS
    // =========================
    const updatedClass = await classService.updateClassDetails(input);

    // =========================
    // SUCCESS RESPONSE
    // =========================
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
// SOFT DELETE CLASS
// ===============================
async deleteClass(req: Request, res: Response, next: NextFunction) {
  try {
    // =========================
    // EXTRACT PARAMS
    // =========================
    const params = {
      id: Number(req.params.id),
    };

    // =========================
    // DELETE CLASS
    // =========================
    const deletedClass = await classService.deleteClass(params);

    // =========================
    // SUCCESS RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      data: deletedClass,
    });
  } catch (error) {
    next(error);
  }
}

}
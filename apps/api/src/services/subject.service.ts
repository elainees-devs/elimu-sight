
import { ApiError, prisma } from "@utils/index";
import { toSubjectListResponse, toSubjectResponse , SubjectDB} from "mappers";


type GetSubjectParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export class SubjectService {
  // ===============================
  // GET ALL SUBJECTS LOGIC
  // ===============================
  async getAllSubjects(schoolId: string, params: GetSubjectParams) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = params;

      const skip = (page - 1) * limit;

      // =========================
      // FILTER
      // =========================
      const where: any = {
        school_id: schoolId,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [subjects, total] = await Promise.all([
        prisma.subjects.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),

        prisma.subjects.count({ where }),
      ]);

      return {
        data: toSubjectListResponse(subjects),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch subjects");
    }
  }
// ===============================
  // GET SUBJECT BY NAME LOGIC
  // ===============================
  async getSubjectByName(schoolId: string, name: string) {
    try {
      const subject = await prisma.subjects.findFirst({
        where: {
          school_id: schoolId,
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

      if (!subject) {
        throw new ApiError(404, "Subject not found");
      }

      return toSubjectResponse(subject as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch subject by name");
    }
  }


  // ===============================
  // UPDATE SUBJECT DETAILS LOGIC
  // ===============================

  // ===============================
  // SOFT DELETE SUBJECT LOGIC
  // ===============================

  // ===============================
  // COUNT ALL SUBJECTS LOGIC
  // ===============================


}
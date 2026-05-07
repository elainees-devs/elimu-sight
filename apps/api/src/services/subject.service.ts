import { ApiError, prisma, toSubjectIdParam } from "@utils/index";
import { toSubjectListResponse, toSubjectResponse , SubjectDB, toUpdateSubjectDB, toCreateSubjectDB} from "mappers";
import { CreateSubjectInput, SubjectIdParam, UpdateSubjectInput } from "schemas";


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
// CREATE SUBJECT LOGIC
// ===============================
async createSubject(input: CreateSubjectInput) {
  try {
    const { schoolId, name } = input;

    // =========================
    // CHECK DUPLICATE SUBJECT NAME
    // =========================
    const existing = await prisma.subjects.findFirst({
      where: {
        school_id: schoolId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      throw new ApiError(400, "Subject already exists");
    }

    // =========================
    // MAP INPUT → DB
    // =========================
    const dbData = toCreateSubjectDB(input);

    // =========================
    // CREATE SUBJECT
    // =========================
    const subject = await prisma.subjects.create({
      data: dbData,
    });

    // =========================
    // MAP RESPONSE
    // =========================
    return toSubjectResponse(subject as SubjectDB);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to create subject");
  }
}


  // ===============================
  // UPDATE SUBJECT DETAILS LOGIC
  // ===============================
  async updateSubjectDetails(input: UpdateSubjectInput) {
    try {
      const { id, ...updateData } = input;

      // =========================
      // CHECK IF SUBJECT EXISTS
      // =========================
      const existingSubject = await prisma.subjects.findUnique({
        where: { id },
      });

      if (!existingSubject) {
        throw new ApiError(404, "Subject not found");
      }

      // =========================
      // OPTIONAL: DUPLICATE NAME CHECK
      // =========================
      if (updateData.name) {
        const duplicate = await prisma.subjects.findFirst({
          where: {
            school_id: existingSubject.school_id,
            name: updateData.name,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ApiError(400, "Subject name already exists");
        }
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toUpdateSubjectDB(updateData);

      // =========================
      // UPDATE SUBJECT
      // =========================
      const updatedSubject = await prisma.subjects.update({
        where: { id },
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toSubjectResponse(updatedSubject as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update subject");
    }
  }
 // ===============================
  // SOFT DELETE SUBJECT LOGIC
  // ===============================
  async deleteSubject(params: SubjectIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toSubjectIdParam(params);

      // =========================
      // SOFT DELETE
      // =========================
      const updated = await prisma.subjects.updateMany({
        where: {
          id,
        },
        data: {
          updated_at: new Date(),
          deleted_at: new Date(),
        },
      });

      // =========================
      // NOT FOUND CHECK
      // =========================
      if (updated.count === 0) {
        throw new ApiError(404, "Subject not found");
      }

      // =========================
      // FETCH UPDATED RECORD
      // =========================
      const subject = await prisma.subjects.findUnique({
        where: { id },
      });

      if (!subject) {
        throw new ApiError(404, "Subject not found after deletion");
      }

      // =========================
      // MAP RESPONSE
      // =========================
      return toSubjectResponse(subject as SubjectDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to delete subject");
    }
  }
 // ===============================
  // COUNT ALL SUBJECTS LOGIC
  // ===============================
  async getSubjectCount(schoolId: string) {
    try {
      const count = await prisma.subjects.count({
        where: {
          school_id: schoolId,
          deleted_at: null,
        },
      });

      return count;
    } catch (error) {
      throw new ApiError(500, "Failed to get subject count");
    }
  }
}





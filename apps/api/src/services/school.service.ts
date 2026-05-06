import { ApiError } from "@utils/app-error";
import { prisma } from "@utils/prisma";
import { SchoolDB, toCreateSchoolDB, toSchoolId, toSchoolListResponse, toSchoolResponse, toUpdateSchoolDB } from "mappers/school.mapper";
import { CreateSchoolInput, SchoolIdParam, UpdateSchoolInput } from "schemas";

type GetSchoolsParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const SchoolService = {
  // =========================
  // GET ALL SCHOOLS LOGIC
  // =========================
  async getAllSchools(params: GetSchoolsParams) {
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
      // FILTERING
      // =========================
      const where: any = {
        deleted_at: null,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [schools, total] = await Promise.all([
        prisma.schools.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),
        prisma.schools.count({ where }),
      ]);

      return {
        data: toSchoolListResponse(schools),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(500, "Failed to fetch schools");
    }
  },
  // =========================
  // GET SCHOOL BY EMAIL LOGIC
  // =========================
  async getSchoolByEmail(email: string) {
    try {
      const school = await prisma.schools.findFirst({
        where: {
          email,
          deleted_at: null,
        },
      });

      if (!school) {
        throw new ApiError(404, "School not found");
      }

      return school;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch school by email");
    }
  },
  // =========================
  // CREATE NEW SCHOOL LOGIC
  // =========================
  async createSchool(input: CreateSchoolInput) {
    try {
      const { email } = input;

      // Check if email already exists
      const existingSchool = await prisma.schools.findFirst({
        where: {
          email,
          deleted_at: null,
        },
      });

      if (existingSchool) {
        throw new ApiError(400, "Email already in use");
      }

      // =========================
      // MAP INPUT → DB SHAPE
      // =========================
      const dbData = toCreateSchoolDB(input);

      const newSchool = await prisma.schools.create({
        data: dbData,
      });

      // =========================
      // MAP DB → API RESPONSE
      // =========================
      return toSchoolResponse(newSchool);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to create school");
    }
  },
// =========================
// UPDATE SCHOOL DETAILS LOGIC
// =========================
async updateSchool(input: UpdateSchoolInput) {
  try {
    const { id, email } = input;

    // =========================
    // CHECK IF SCHOOL EXISTS
    // =========================
    const existingSchool = await prisma.schools.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingSchool) {
      throw new ApiError(404, "School not found");
    }

    // =========================
    // OPTIONAL: CHECK EMAIL CONFLICT
    // =========================
    if (email && email !== existingSchool.email) {
      const emailTaken = await prisma.schools.findFirst({
        where: {
          email,
          deleted_at: null,
          NOT: { id },
        },
      });

      if (emailTaken) {
        throw new ApiError(400, "Email already in use");
      }
    }

    // =========================
    // MAP INPUT → DB SHAPE
    // =========================
    const dbData = toUpdateSchoolDB(input);

    // =========================
    // UPDATE SCHOOL
    // =========================
    const updatedSchool = await prisma.schools.update({
      where: { id },
      data: dbData,
    });

    // =========================
    // MAP DB → RESPONSE
    // =========================
    return toSchoolResponse(updatedSchool);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to update school");
  }
},
// =========================
// SOFT DELETE SCHOOL LOGIC
// =========================
async deleteSchool(params: SchoolIdParam) {
  try {
    // =========================
    // VALIDATE ID
    // =========================
    const id = toSchoolId(params);

    // =========================
    // SOFT DELETE (RETURN UPDATED ROW)
    // =========================
    const updated = await prisma.schools.updateMany({
      where: {
        id,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
        updated_at: new Date(),
      },
    });

    // =========================
    // NOT FOUND CHECK
    // =========================
    if (updated.count === 0) {
      throw new ApiError(404, "School not found");
    }

    // =========================
    // FETCH UPDATED RECORD (FOR MAPPER)
    // =========================
    const school = await prisma.schools.findFirst({
      where: { id },
    });

    if (!school) {
      throw new ApiError(404, "School not found after deletion");
    }

    // =========================
    // MAP TO API RESPONSE
    // =========================
    return toSchoolResponse(school as SchoolDB);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to delete school");
  }
},

// =========================
// GET SCHOOL COUNT LOGIC
// =========================
async getSchoolCount() {
  try {
    const count = await prisma.schools.count({
      where: {
        deleted_at: null,
      },
    });

    return count;
  } catch (error) {
    throw new ApiError(500, "Failed to get school count");
  }
}
}

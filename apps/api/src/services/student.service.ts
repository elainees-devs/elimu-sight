import { ApiError, prisma } from "@utils/index";;
import { StudentDB, toCreateStudentDB, toStudentListResponse, toStudentResponse, toStudentId, toUpdateStudentDB } from "mappers";
import { CreateStudentInput, StudentIdParam, UpdateStudentInput } from "schemas";

type GetStudentParams = {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  isActive?: boolean;
};
export class StudentService {
// ===============================
  // GET ALL STUDENTS BY SCHOOL LOGIC
  // ===============================
  async getAllStudentsBySchool(
    schoolId: string,
    params: GetStudentParams
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        classId,
        isActive,
      } = params;

      const skip = (page - 1) * limit;

      // =========================
      // FILTER
      // =========================
      const where: any = {
        school_id: schoolId,
      };

      if (classId) {
        where.class_id = classId;
      }

      if (isActive !== undefined) {
        where.is_active = isActive;
      }

      if (search) {
        where.OR = [
          {
            full_name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            admission_number: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            guardian_name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            guardian_phone: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [students, total] = await Promise.all([
        prisma.students.findMany({
          where,
          orderBy: {
            created_at: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.students.count({ where }),
      ]);

      // =========================
      // RESPONSE
      // =========================
      return {
        data: toStudentListResponse(students),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch students"
      );
    }
  }

// ===============================
// CREATE STUDENT LOGIC
// ===============================

  async createStudent(input: CreateStudentInput) {
    try {
      const {
        schoolId,
        admissionNumber,
      } = input;

      // =========================
      // CHECK DUPLICATE ADMISSION NUMBER (if provided)
      // =========================
      if (admissionNumber) {
        const existing = await prisma.students.findFirst({
          where: {
            school_id: schoolId,
            admission_number: admissionNumber,
          },
        });

        if (existing) {
          throw new ApiError(
            400,
            "Admission number already exists"
          );
        }
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toCreateStudentDB(input);

      // =========================
      // CREATE STUDENT
      // =========================
      const student = await prisma.students.create({
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(
        student as StudentDB
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to create student"
      );
    }
  }
  // ===============================
  // GET STUDENT BY ID LOGIC
  // ===============================
  async getStudentById(params: StudentIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toStudentId(params);

      // =========================
      // FETCH STUDENT
      // =========================
      const student = await prisma.students.findFirst({
        where: {
          id,
        },
      });

      // =========================
      // NOT FOUND CHECK
      // =========================
      if (!student) {
        throw new ApiError(404, "Student not found");
      }

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(student as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to fetch student"
      );
    }
  }

// ===============================
  // UPDATE STUDENT DETAILS LOGIC
  // ===============================
  async updateStudentDetails(input: UpdateStudentInput) {
    try {
      const { id, ...updateData } = input;

      // =========================
      // VALIDATE ID
      // =========================
      const studentId = toStudentId({ id });

      // =========================
      // CHECK IF STUDENT EXISTS
      // =========================
      const existing = await prisma.students.findUnique({
        where: { id: studentId },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      // =========================
      // MAP INPUT → DB
      // =========================
      const dbData = toUpdateStudentDB(updateData);

      // =========================
      // UPDATE STUDENT
      // =========================
      const updated = await prisma.students.update({
        where: { id: studentId },
        data: dbData,
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to update student details"
      );
    }
  }

   // ===============================
  // SOFT DELETE STUDENT LOGIC
  // ===============================
  async deleteStudent(params: StudentIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toStudentId(params);

      // =========================
      // CHECK IF STUDENT EXISTS
      // =========================
      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      // =========================
      // SOFT DELETE (DEACTIVATE)
      // =========================
      const updated = await prisma.students.update({
        where: { id },
        data: {
          is_active: false,
          updated_at: new Date(),
        },
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to delete student"
      );
    }
  }
  // ===============================
  // ACTIVATE STUDENT LOGIC
  // ===============================
  async activateStudent(params: StudentIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toStudentId(params);

      // =========================
      // CHECK IF STUDENT EXISTS
      // =========================
      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      // =========================
      // CHECK IF ALREADY ACTIVE
      // =========================
      if (existing.is_active) {
        throw new ApiError(
          400,
          "Student is already active"
        );
      }

      // =========================
      // ACTIVATE STUDENT
      // =========================
      const updated = await prisma.students.update({
        where: { id },
        data: {
          is_active: true,
          updated_at: new Date(),
        },
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to activate student"
      );
    }
  }
 // ===============================
  // DEACTIVATE STUDENT LOGIC
  // ===============================
  async deactivateStudent(params: StudentIdParam) {
    try {
      // =========================
      // VALIDATE ID
      // =========================
      const id = toStudentId(params);

      // =========================
      // CHECK IF STUDENT EXISTS
      // =========================
      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      // =========================
      // CHECK IF ALREADY INACTIVE
      // =========================
      if (!existing.is_active) {
        throw new ApiError(
          400,
          "Student is already inactive"
        );
      }

      // =========================
      // DEACTIVATE STUDENT
      // =========================
      const updated = await prisma.students.update({
        where: { id },
        data: {
          is_active: false,
          updated_at: new Date(),
        },
      });

      // =========================
      // MAP RESPONSE
      // =========================
      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Failed to deactivate student"
      );
    }
  }
// ===============================
  // GET STUDENTS BY CLASS LOGIC
  // ===============================
  async getStudentsByClass(
    classId: string,
    params: GetStudentParams
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        isActive,
      } = params;

      const skip = (page - 1) * limit;

      // =========================
      // FILTER
      // =========================
      const where: any = {
        class_id: classId,
      };

      if (isActive !== undefined) {
        where.is_active = isActive;
      }

      if (search) {
        where.OR = [
          {
            full_name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            admission_number: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            guardian_name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      // =========================
      // QUERY
      // =========================
      const [students, total] = await Promise.all([
        prisma.students.findMany({
          where,
          orderBy: {
            created_at: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.students.count({ where }),
      ]);

      // =========================
      // RESPONSE
      // =========================
      return {
        data: toStudentListResponse(students),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch students by class"
      );
    }
  }

}


// ===============================
// COUNT ALL STUDENTS LOGIC
// ===============================

// ===============================
// TRANSFER STUDENT CLASS LOGIC
// ===============================

// ===============================
// GET STUDENT STATISTICS LOGIC
// ===============================

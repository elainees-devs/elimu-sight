import { ApiError, prisma } from "@utils/index";
import {
  StudentDB,
  toCreateStudentDB,
  toStudentListResponse,
  toStudentResponse,
  toStudentId,
  toUpdateStudentDB,
} from "mappers";
import {
  CreateStudentInput,
  StudentIdParam,
  UpdateStudentInput,
} from "schemas";

type GetStudentParams = {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  isActive?: boolean;
};

type CountStudentsParams = {
  classId?: string;
  isActive?: boolean;
};

export class StudentService {
  // ===================================
  // GET ALL STUDENTS BY SCHOOL
  // ===================================
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

      const where: any = {
        school_id: schoolId,
      };

      if (classId) where.class_id = classId;
      if (isActive !== undefined) where.is_active = isActive;

      if (search) {
        where.OR = [
          { full_name: { contains: search, mode: "insensitive" } },
          { admission_number: { contains: search, mode: "insensitive" } },
          { guardian_name: { contains: search, mode: "insensitive" } },
          { guardian_phone: { contains: search, mode: "insensitive" } },
        ];
      }

      const [students, total] = await Promise.all([
        prisma.students.findMany({
          where,
          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        }),
        prisma.students.count({ where }),
      ]);

      return {
        data: toStudentListResponse(students as StudentDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      throw new ApiError(500, "Failed to fetch students");
    }
  }

  // ===================================
  // CREATE STUDENT
  // ===================================
  async createStudent(input: CreateStudentInput) {
    try {
      const { schoolId, admissionNumber } = input;

      if (admissionNumber) {
        const existing = await prisma.students.findFirst({
          where: {
            school_id: schoolId,
            admission_number: admissionNumber,
          },
        });

        if (existing) {
          throw new ApiError(400, "Admission number already exists");
        }
      }

      const dbData = toCreateStudentDB(input);

      const created = await prisma.students.create({
        data: dbData,
      });

      return toStudentResponse(created as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create student");
    }
  }

  // ===================================
  // GET STUDENT BY ID
  // ===================================
  async getStudentById(params: StudentIdParam) {
    try {
      const id = toStudentId(params);

      const student = await prisma.students.findFirst({
        where: { id },
      });

      if (!student) {
        throw new ApiError(404, "Student not found");
      }

      return toStudentResponse(student as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to fetch student");
    }
  }

  // ===================================
  // UPDATE STUDENT
  // ===================================
  async updateStudentDetails(input: UpdateStudentInput) {
    try {
      const { id, ...data } = input;

      const studentId = toStudentId({ id });

      const existing = await prisma.students.findUnique({
        where: { id: studentId },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      const dbData = toUpdateStudentDB(data);

      const updated = await prisma.students.update({
        where: { id: studentId },
        data: dbData,
      });

      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update student details");
    }
  }

  // ===================================
  // DELETE STUDENT (SOFT DELETE)
  // ===================================
  async deleteStudent(params: StudentIdParam) {
    try {
      const id = toStudentId(params);

      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      const updated = await prisma.students.update({
        where: { id },
        data: {
          is_active: false,
        },
      });

      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to delete student");
    }
  }

  // ===================================
  // ACTIVATE STUDENT
  // ===================================
  async activateStudent(params: StudentIdParam) {
    try {
      const id = toStudentId(params);

      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      if (existing.is_active) {
        throw new ApiError(400, "Student is already active");
      }

      const updated = await prisma.students.update({
        where: { id },
        data: { is_active: true },
      });

      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to activate student");
    }
  }

  // ===================================
  // DEACTIVATE STUDENT
  // ===================================
  async deactivateStudent(params: StudentIdParam) {
    try {
      const id = toStudentId(params);

      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      if (!existing.is_active) {
        throw new ApiError(400, "Student is already inactive");
      }

      const updated = await prisma.students.update({
        where: { id },
        data: { is_active: false },
      });

      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to deactivate student");
    }
  }

  // ===================================
  // GET STUDENTS BY CLASS
  // ===================================
  async getStudentsByClass(
    classId: string,
    params: GetStudentParams
  ) {
    try {
      const { page = 1, limit = 10, search, isActive } = params;

      const skip = (page - 1) * limit;

      const where: any = {
        class_id: classId,
      };

      if (isActive !== undefined) where.is_active = isActive;

      if (search) {
        where.OR = [
          { full_name: { contains: search, mode: "insensitive" } },
          { admission_number: { contains: search, mode: "insensitive" } },
          { guardian_name: { contains: search, mode: "insensitive" } },
        ];
      }

      const [students, total] = await Promise.all([
        prisma.students.findMany({
          where,
          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        }),
        prisma.students.count({ where }),
      ]);

      return {
        data: toStudentListResponse(students as StudentDB[]),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      throw new ApiError(500, "Failed to fetch students by class");
    }
  }

  // ===================================
  // COUNT STUDENTS
  // ===================================
  async countAllStudents(
    schoolId: string,
    params: CountStudentsParams
  ) {
    try {
      const { classId, isActive } = params;

      const where: any = {
        school_id: schoolId,
      };

      if (classId) where.class_id = classId;
      if (isActive !== undefined) where.is_active = isActive;

      const total = await prisma.students.count({ where });

      return { total };
    } catch {
      throw new ApiError(500, "Failed to count students");
    }
  }

  // ===================================
  // TRANSFER STUDENT CLASS
  // ===================================
  async transferStudentClass(
    params: StudentIdParam,
    newClassId: string
  ) {
    try {
      const id = toStudentId(params);

      const existing = await prisma.students.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new ApiError(404, "Student not found");
      }

      if (existing.class_id === newClassId) {
        throw new ApiError(400, "Student already in this class");
      }

      const classExists = await prisma.classes.findUnique({
        where: { id: newClassId },
      });

      if (!classExists) {
        throw new ApiError(404, "Class not found");
      }

      const updated = await prisma.students.update({
        where: { id },
        data: { class_id: newClassId },
      });

      return toStudentResponse(updated as StudentDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to transfer student class");
    }
  }

  // ===================================
  // STUDENT STATISTICS
  // ===================================
  async getStudentStatistics(schoolId: string) {
    try {
      const totalStudents = await prisma.students.count({
        where: { school_id: schoolId },
      });

      const activeStudents = await prisma.students.count({
        where: { school_id: schoolId, is_active: true },
      });

      const inactiveStudents = await prisma.students.count({
        where: { school_id: schoolId, is_active: false },
      });

      const byClass = await prisma.students.groupBy({
        by: ["class_id"],
        where: { school_id: schoolId },
        _count: { id: true },
      });

      const byGender = await prisma.students.groupBy({
        by: ["gender"],
        where: { school_id: schoolId },
        _count: { id: true },
      });

      return {
        totalStudents,
        activeStudents,
        inactiveStudents,
        byClass,
        byGender,
      };
    } catch {
      throw new ApiError(500, "Failed to fetch student statistics");
    }
  }
}
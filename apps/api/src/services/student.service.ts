import { ApiError, prisma } from "@utils/index";;
import { StudentDB, toCreateStudentDB, toStudentResponse } from "mappers";
import { CreateStudentInput } from "schemas";

export class StudentService {
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
}

// ===============================
// GET ALL STUDENTS BY SCHOOL LOGIC
// ===============================

// ===============================
// GET STUDENT BY ID LOGIC
// ===============================

// ===============================
// UPDATE STUDENT DETAILS LOGIC
// ===============================

// ===============================
// SOFT DELETE STUDENT LOGIC
// ===============================

// ===============================
// ACTIVATE STUDENT LOGIC
// ===============================

// ===============================
// DEACTIVATE STUDENT LOGIC
// ===============================

// ===============================
// GET STUDENTS BY CLASS LOGIC
// ===============================

// ===============================
// COUNT ALL STUDENTS LOGIC
// ===============================

// ===============================
// TRANSFER STUDENT CLASS LOGIC
// ===============================

// ===============================
// GET STUDENT STATISTICS LOGIC
// ===============================

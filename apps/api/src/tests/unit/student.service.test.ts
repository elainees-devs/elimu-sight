import { StudentService } from "../../services/student.service";
import { prisma } from "../../utils/prisma";
import { ApiError } from "../../utils/app-error";

jest.mock("../../utils/prisma", () => ({
  prisma: {
    students: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("StudentService", () => {
  let studentService: StudentService;

  beforeEach(() => {
    studentService = new StudentService();
    jest.clearAllMocks();
  });

  describe("getAllStudentsBySchool", () => {
    it("should return students and pagination meta", async () => {
      const mockStudents = [
        {
          id: "11111111-1111-1111-1111-111111111111",
          full_name: "John Doe",
          school_id: "22222222-2222-2222-2222-222222222222",
          class_id: "33333333-3333-3333-3333-333333333333",
          admission_number: "ADM001",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "44444444-4444-4444-4444-444444444444",
          full_name: "Jane Doe",
          school_id: "22222222-2222-2222-2222-222222222222",
          class_id: "33333333-3333-3333-3333-333333333333",
          admission_number: "ADM002",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      (prisma.students.findMany as jest.Mock).mockResolvedValue(mockStudents);
      (prisma.students.count as jest.Mock).mockResolvedValue(2);

      const result = await studentService.getAllStudentsBySchool("22222222-2222-2222-2222-222222222222", {
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(prisma.students.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { school_id: "22222222-2222-2222-2222-222222222222" },
        })
      );
    });

    it("should throw ApiError 500 if prisma fails", async () => {
      (prisma.students.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(
        studentService.getAllStudentsBySchool("school-1", {})
      ).rejects.toThrow(ApiError);
    });
  });

  describe("createStudent", () => {
    it("should throw error if admission number already exists", async () => {
      (prisma.students.findFirst as jest.Mock).mockResolvedValue({ id: "existing" });

      await expect(
        studentService.createStudent({
          schoolId: "school-1",
          admissionNumber: "ADM001",
          fullName: "New Student",
        } as any)
      ).rejects.toThrow("Admission number already exists");
    });
  });
});

import { StudentController } from "../../controllers/student.controller";
import { StudentService } from "../../services/student.service";
import { Request, Response, NextFunction } from "express";

jest.mock("../../services/student.service");
jest.mock("../../utils/audit", () => ({
  logAudit: jest.fn().mockResolvedValue({}),
}));

describe("StudentController", () => {
  let controller: StudentController;
  let req: any;
  let res: any;
  let next: NextFunction;
  let mockStudentService: jest.Mocked<StudentService>;

  beforeEach(() => {
    controller = new StudentController();
    mockStudentService = (controller as any).studentService as jest.Mocked<StudentService>;
    req = {
      body: {},
      params: {},
      user: { id: "user-1", schoolId: "school-1" },
      ip: "127.0.0.1",
      headers: { "user-agent": "jest" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should return 201 and the created student", async () => {
      const mockResult = { id: "11111111-1111-1111-1111-111111111111", fullName: "John Doe", schoolId: "22222222-2222-2222-2222-222222222222" };
      mockStudentService.createStudent.mockResolvedValue(mockResult as any);

      req.body = { fullName: "John Doe", schoolId: "22222222-2222-2222-2222-222222222222" };
      await controller.createStudent(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockResult,
        })
      );
    });

    it("should call next with error if service fails", async () => {
      const error = new Error("Failed");
      mockStudentService.createStudent.mockRejectedValue(error);

      await controller.createStudent(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getStudentById", () => {
    it("should return 200 and the student", async () => {
      const mockResult = { id: "11111111-1111-1111-1111-111111111111", fullName: "John Doe" };
      mockStudentService.getStudentById.mockResolvedValue(mockResult as any);

      req.params.id = "11111111-1111-1111-1111-111111111111";
      await controller.getStudentById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockResult,
        })
      );
    });
  });
});

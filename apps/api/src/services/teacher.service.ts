import { ApiError, prisma, logger } from "@utils/index";
import { toUserResponse } from "mappers/user.mapper";
import type { UserDB } from "mappers/user.mapper";

export class TeacherService {
  async listTeachers(schoolId: string) {
    try {
      const teachers = await prisma.users.findMany({
        where: {
          school_id: schoolId,
          role: "TEACHER",
          is_active: true,
        },
        orderBy: { full_name: "asc" },
      });

      return teachers.map((t) => toUserResponse(t as UserDB));
    } catch {
      logger.error("Failed to fetch teachers");
      throw new ApiError(500, "Failed to fetch teachers");
    }
  }

  async getTeacherDetail(id: string, schoolId: string) {
    try {
      const teacher = await prisma.users.findFirst({
        where: {
          id,
          school_id: schoolId,
          role: "TEACHER",
          is_active: true,
        },
        include: {
          teacher: true,
        },
      });

      if (!teacher) {
        throw new ApiError(404, "Teacher not found");
      }

      return toUserResponse(teacher as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to fetch teacher detail", { error });
      throw new ApiError(500, "Failed to fetch teacher detail");
    }
  }

  async updateTeacher(id: string, schoolId: string, input: { fullName?: string; email?: string }) {
    try {
      const existing = await prisma.users.findFirst({
        where: {
          id,
          school_id: schoolId,
          role: "TEACHER",
          is_active: true,
        },
      });

      if (!existing) {
        throw new ApiError(404, "Teacher not found");
      }

      const updateData: Record<string, unknown> = {};
      if (input.fullName !== undefined) updateData.full_name = input.fullName;
      if (input.email !== undefined) updateData.email = input.email;
      updateData.updated_at = new Date();

      const updated = await prisma.users.update({
        where: { id },
        data: updateData,
      });

      return toUserResponse(updated as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to update teacher", { error });
      throw new ApiError(500, "Failed to update teacher");
    }
  }

  async assignClass(id: string, schoolId: string, classId: string) {
    try {
      const teacher = await prisma.users.findFirst({
        where: {
          id,
          school_id: schoolId,
          role: "TEACHER",
          is_active: true,
        },
      });

      if (!teacher) {
        throw new ApiError(404, "Teacher not found");
      }

      const classEntity = await prisma.classes.findFirst({
        where: {
          id: classId,
          school_id: schoolId,
          is_active: true,
        },
      });

      if (!classEntity) {
        throw new ApiError(404, "Class not found");
      }

      const updated = await prisma.users.update({
        where: { id },
        data: {
          assigned_class_id: classId,
          updated_at: new Date(),
        },
      });

      return toUserResponse(updated as UserDB);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Failed to assign class to teacher", { error });
      throw new ApiError(500, "Failed to assign class to teacher");
    }
  }
}

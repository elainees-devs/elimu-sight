import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { UserService } from "@services/index";

import { toUserId, toSchoolId } from "mappers";
import { UserIdParam, SchoolIdParam } from "schemas";

const userService = new UserService();

export class UserController {
  // ===================================
  // GET ALL USERS BY SCHOOL
  // ===================================
  async getAllUsersBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolId = toSchoolId({
        id: req.params.schoolId,
      } as SchoolIdParam);

      const result = await userService.getAllUsersBySchool(schoolId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as "full_name" | "created_at",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        search: req.query.search ? String(req.query.search) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET USER BY EMAIL (scoped to authenticated user's school)
  // ===================================
  async getUserByEmail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const email = req.params.email as string;
      const authUser = req.user!;

      const user = await userService.getUserByEmail(
        email,
        authUser?.role === "ADMIN" ? undefined : authUser?.schoolId
      );

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // UPDATE USER DETAILS
  // ===================================
  async updateUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toUserId({
        id: req.params.id,
      } as UserIdParam);

      const input = {
        ...req.body,
        id,
      };

      const user = await userService.updateUserDetails(input);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // DELETE USER
  // ===================================
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = toUserId({
        id: req.params.id,
      } as UserIdParam);

      const user = await userService.deleteUser({ id });

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===================================
  // GET USER COUNT
  // ===================================
  async getUserCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await userService.getUserCount();

      return res.status(200).json({
        success: true,
        message: "User count fetched successfully",
        data: { count },
      });
    } catch (error) {
      return next(error);
    }
  }
}
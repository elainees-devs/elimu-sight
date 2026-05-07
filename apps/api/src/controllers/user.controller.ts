import { Request, Response, NextFunction } from "express";
import { UserService } from "@services/index";
import {
  toSchoolIdParam,toIdParam,
  toEmailParam
} from "@utils/index";

const userService = new UserService();

export const UserController = {
  // ===============================
  // GET ALL USERS BY SCHOOL LOGIC
  // ===============================
  async getAllUsersBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = toSchoolIdParam(req);

      const params = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as "full_name" | "created_at",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        search: req.query.search as string,
      };

      const result = await userService.getAllUsersBySchool(
        schoolId,
        params
      );

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // GET USER BY EMAIL LOGIC
  // ===============================
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = toEmailParam(req);

      const user = await userService.getUserByEmail(email);

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // UPDATE USER DETAILS LOGIC
  // ===============================
  async updateUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.body,
        id: toIdParam(req).id,
      };

      const user = await userService.updateUserDetails(input);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // DELETE USER LOGIC
  // ===============================
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.deleteUser(toIdParam(req));

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // ===============================
  // GET USER COUNT LOGIC
  // ===============================
  async getUserCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await userService.getUserCount();

      res.status(200).json({
        success: true,
        message: "User count fetched successfully",
        data: count,
      });
    } catch (error) {
      next(error);
    }
  },
};
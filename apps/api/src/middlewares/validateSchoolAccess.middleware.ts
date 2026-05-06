import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { AuthService } from "@services/index";

const authService = new AuthService();

export const validateSchoolAccess = (schoolIdParam: string = "schoolId") =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || (req as any).user?.id;
      const schoolId = req.params[schoolIdParam] || req.query[schoolIdParam] || req.body[schoolIdParam];

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const hasAccess = await authService.validateSchoolAccess(
        userId,
        schoolId
      );

      if (!hasAccess) {
        return res.status(403).json({
          message: "You do not have access to this school",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
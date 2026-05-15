import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { ApiError, Roles } from "@utils/index";

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        throw new ApiError(401, "Authentication required");
      }

      if (!Roles.includes(userRole as (typeof Roles)[number])) {
        throw new ApiError(403, "Invalid role");
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          `Access denied. Required role: ${allowedRoles.join(" or ")}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

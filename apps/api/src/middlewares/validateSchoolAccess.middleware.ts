import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { prisma, ApiError } from "@utils/index";

export async function validateSchoolAccess(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id || (req as any).user?.id;
    const schoolId = req.params.schoolId || req.body.schoolId;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const hasAccess =
      user.role === "ADMIN" || user.school_id === schoolId;

    if (!hasAccess) {
      throw new ApiError(
        403,
        "You do not have access to this school"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
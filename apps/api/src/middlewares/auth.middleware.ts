import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@utils/index";
import { AuthRequest } from "../types/express";

type TokenPayload = JwtPayload & {
  id: string;
};

export const authenticateMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization?.trim();

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        school_id: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role ?? "user",
      schoolId: user.school_id,
    };

    return next();
  } catch {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
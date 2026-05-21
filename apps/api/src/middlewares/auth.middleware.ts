import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";
import { JwtPayload } from "../utils/jwt";
import { env } from "../config/env";

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
      env.JWT_SECRET
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email ?? "",
      role: decoded.role,
      schoolId: decoded.schoolId,
    };

    return next();
  } catch {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
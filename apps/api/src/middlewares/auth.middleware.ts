import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils";

// Extend the Express Request type to include the user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const authenticateMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // NORMALIZE USER
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

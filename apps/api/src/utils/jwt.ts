import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@config/env";
import { Roles } from "./constants";

export interface JwtPayload {
  id: string;
  email?: string;
  name: string;
  role: (typeof Roles)[number];
  schoolId?: string;
}

const JWT_SECRET = env.JWT_SECRET;

/**
 * Generate JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

/**
 * Verify JWT token and return decoded payload
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};


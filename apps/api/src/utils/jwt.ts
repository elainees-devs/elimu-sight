import dotenv from "dotenv";

dotenv.config();
import jwt, { SignOptions } from "jsonwebtoken";
import { Roles } from "./constants";

export interface JwtPayload {
  id: string;
  email?: string;
  roles: (typeof Roles)[number];
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "1d";

/**
 * Generate JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
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

/**
 * Refresh token
 */
export const refreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true,
    }) as JwtPayload;

    return generateToken({
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
    });
  } catch {
    return null;
  }
};
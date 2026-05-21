import "express";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        schoolId?: string;
      };
    }
  }
}

export type AuthRequest = import("express-serve-static-core").Request;
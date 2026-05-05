import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const timestamp = new Date().toISOString();

  const isTest = process.env.NODE_ENV === "test";

  // ======================
  // LOGGING STRATEGY
  // ======================

  // No logs during tests (clean Jest output)
  if (!isTest) {
    if (statusCode >= 500) {
      console.error(
        `[${timestamp}] [ERROR] ${req.method} ${req.path}: ${err.message}`
      );
    } else {
      console.warn(
        `[${timestamp}] [WARN] ${req.method} ${req.path}: ${err.message}`
      );
    }

    if (process.env.NODE_ENV === "development" && statusCode === 500) {
      console.error(err.stack);
    }
  }

  // ======================
  // RESPONSE
  // ======================
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
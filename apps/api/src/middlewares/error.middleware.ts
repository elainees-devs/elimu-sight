import { Request, Response, NextFunction } from "express";
import { logger, env } from "@utils/index";
import { sendError } from "@utils/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const requestId = (req as any).requestId;

  // ======================
  // LOGGING STRATEGY
  // ======================

  if (!env.isTest) {
    const logMeta = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode,
      ...(err.details ? { details: err.details } : {}),
    };

    if (statusCode >= 500) {
      logger.error(`[${req.method}] ${req.path}: ${err.message}`, {
        ...logMeta,
        stack: env.isDevelopment ? err.stack : undefined,
      });
    } else if (statusCode >= 400) {
      logger.warn(`[${req.method}] ${req.path}: ${err.message}`, logMeta);
    } else {
      logger.info(`[${req.method}] ${req.path}: ${err.message}`, logMeta);
    }
  }

  // ======================
  // RESPONSE
  // ======================
  sendError(
    res,
    err.message || "Internal Server Error",
    statusCode,
    err.details
  );
};
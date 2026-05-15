import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

import { ApiError } from "../utils";

type RequestSource = "body" | "params" | "query";

export const validate =
  (schema: Schema, source: RequestSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // return all errors
      stripUnknown: true, // remove extra fields
    });

    if (error) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          error.details.map((d) => ({
            message: d.message,
            path: d.path,
          }))
        )
      );
    }

    // replace only validated & cleaned data
    (req as unknown as Record<string, unknown>)[source] = value;

    next();
  };
import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

interface ApiPaginatedResponse<T = unknown> {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>(res: Response, data: T, message = "Success", statusCode = 200): void {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T, message = "Created successfully"): void {
  sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = "Data fetched successfully"
): void {
  const body: ApiPaginatedResponse<T> = { success: true, message, data, meta };
  res.status(200).json(body);
}

export function sendError(res: Response, message: string, statusCode = 500, errors?: unknown): void {
  const body: ApiErrorResponse = { success: false, message };
  if (errors !== undefined) {
    body.errors = errors;
  }
  res.status(statusCode).json(body);
}

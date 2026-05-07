// src/modules/subject/subject.mapper.ts

import {
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectIdParam,
  subjectSchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (matches Prisma exactly)
 * =========================
 */
export type SubjectDB = {
  id: string;
  school_id: string;
  name: string;
  code: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * =========================
 * DB → API RESPONSE
 * =========================
 */
export const toSubjectResponse = (db: SubjectDB): Subject => {
  const mapped: Subject = {
    id: db.id,
    schoolId: db.school_id,
    name: db.name,
    code: db.code ?? undefined,
    description: db.description ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };

  const { error, value } = subjectSchema.validate(mapped);

  if (error) {
    throw new Error(`Subject mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → API[]
 * =========================
 */
export const toSubjectListResponse = (rows: SubjectDB[]): Subject[] => {
  return rows.map(toSubjectResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateSubjectDB = (input: CreateSubjectInput) => {
  const { error, value } = createSubjectSchema.validate(input);

  if (error) {
    throw new Error(`Invalid create subject payload: ${error.message}`);
  }

  return {
    school_id: value.schoolId,
    name: value.name,
    code: value.code ?? null,
    description: value.description ?? null,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateSubjectDB = (input: UpdateSubjectInput) => {
  const { error, value } = updateSubjectSchema.validate(input);

  if (error) {
    throw new Error(`Invalid update subject payload: ${error.message}`);
  }

  const update: Record<string, unknown> = {};

  if (value.name !== undefined) update.name = value.name;
  if (value.code !== undefined) update.code = value.code;
  if (value.description !== undefined) update.description = value.description;

  // Prisma @updatedAt will handle this automatically,
  // but keeping it explicit for consistency across mappers
  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toSubjectId = (params: SubjectIdParam): string => {
  const { error, value } = subjectIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid subject ID param: ${error.message}`);
  }

  return value.id;
};
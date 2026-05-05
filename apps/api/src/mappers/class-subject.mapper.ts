// src/modules/class-subject/class-subject.mapper.ts

import {
  ClassSubject,
  CreateClassSubjectInput,
  UpdateClassSubjectInput,
  ClassSubjectIdParam,
  classSubjectSchema,
  createClassSubjectSchema,
  updateClassSubjectSchema,
  classSubjectIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (explicit)
 * =========================
 */
export type ClassSubjectDB = {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string | null;
  created_at: Date;
  updated_at: Date | null;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toClassSubjectResponse = (db: ClassSubjectDB): ClassSubject => {
  const mapped: ClassSubject = {
    id: db.id,
    classId: db.class_id,
    subjectId: db.subject_id,
    teacherId: db.teacher_id ?? undefined,
    createdAt: db.created_at,
  };

  const { error, value } = classSubjectSchema.validate(mapped);
  if (error) {
    throw new Error(`ClassSubject mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toClassSubjectListResponse = (
  rows: ClassSubjectDB[]
): ClassSubject[] => {
  return rows.map(toClassSubjectResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateClassSubjectDB = (
  input: CreateClassSubjectInput
) => {
  const { error, value } = createClassSubjectSchema.validate(input);
  if (error) {
    throw new Error(
      `Invalid create class-subject payload: ${error.message}`
    );
  }

  return {
    class_id: value.classId,
    subject_id: value.subjectId,
    teacher_id: value.teacherId ?? null,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateClassSubjectDB = (
  input: UpdateClassSubjectInput
) => {
  const { error, value } = updateClassSubjectSchema.validate(input);
  if (error) {
    throw new Error(
      `Invalid update class-subject payload: ${error.message}`
    );
  }

  const update: Record<string, any> = {};

  if (value.teacherId !== undefined) {
    update.teacher_id = value.teacherId;
  }

  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toClassSubjectId = (
  params: ClassSubjectIdParam
): string => {
  const { error, value } = classSubjectIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid class-subject ID param: ${error.message}`);
  }

  return value.id;
};
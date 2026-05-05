// src/modules/class/class.mapper.ts

import {
  Class,
  CreateClassInput,
  UpdateClassInput,
  ClassIdParam,
  classSchema,
  createClassSchema,
  updateClassSchema,
  classIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (explicit)
 * =========================
 */
export type ClassDB = {
  id: string;
  name: string | null;
  level: string | null;
  stream: string | null;
  academic_year: string | null;

  school_id: string;
  class_teacher_id: string | null;

  created_at: Date;
  updated_at: Date | null;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toClassResponse = (db: ClassDB): Class => {
  const mapped: Class = {
    id: db.id,
    name: db.name ?? undefined,
    level: db.level ?? undefined,
    stream: db.stream ?? undefined,
    academicYear: db.academic_year ?? undefined,

    schoolId: db.school_id,
    classTeacherId: db.class_teacher_id ?? undefined,

    createdAt: db.created_at,
    updatedAt: db.updated_at ?? undefined,
  };

  const { error, value } = classSchema.validate(mapped);
  if (error) {
    throw new Error(`Class mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toClassListResponse = (rows: ClassDB[]): Class[] => {
  return rows.map(toClassResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateClassDB = (input: CreateClassInput) => {
  const { error, value } = createClassSchema.validate(input);
  if (error) {
    throw new Error(`Invalid create class payload: ${error.message}`);
  }

  return {
    name: value.name,
    level: value.level,
    stream: value.stream,
    academic_year: value.academicYear,
    school_id: value.schoolId,
    class_teacher_id: value.classTeacherId ?? null,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateClassDB = (input: UpdateClassInput) => {
  const { error, value } = updateClassSchema.validate(input);
  if (error) {
    throw new Error(`Invalid update class payload: ${error.message}`);
  }

  const update: Record<string, any> = {};

  if (value.name !== undefined) update.name = value.name;
  if (value.level !== undefined) update.level = value.level;
  if (value.stream !== undefined) update.stream = value.stream;
  if (value.academicYear !== undefined)
    update.academic_year = value.academicYear;

  if (value.classTeacherId !== undefined)
    update.class_teacher_id = value.classTeacherId;

  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toClassId = (params: ClassIdParam): string => {
  const { error, value } = classIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid class ID param: ${error.message}`);
  }

  return value.id;
};
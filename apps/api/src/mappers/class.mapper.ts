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

import { Prisma } from "@prisma/client";

/**
 * =========================
 * DB TYPE (matches Prisma exactly)
 * =========================
 */
export type ClassDB = {
  id: string;

  name: string;
  level: string;
  stream: string;
  academic_year: string;

  school_id: string;
  class_teacher_id: string | null;

  created_at: Date;
  updated_at: Date;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toClassResponse = (db: ClassDB): Class => {
  const mapped: Class = {
    id: db.id,

    name: db.name,
    level: db.level,
    stream: db.stream,
    academicYear: db.academic_year,

    schoolId: db.school_id,
    classTeacherId: db.class_teacher_id ?? undefined,

    createdAt: db.created_at,
    updatedAt: db.updated_at,
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
export const toUpdateClassDB = (input: UpdateClassInput): Prisma.classesUpdateInput => {
  const { error, value } = updateClassSchema.validate(input);

  if (error) {
    throw new Error(`Invalid update class payload: ${error.message}`);
  }

  return {
    ...(value.name !== undefined && { name: value.name }),
    ...(value.level !== undefined && { level: value.level }),
    ...(value.stream !== undefined && { stream: value.stream }),

    ...(value.academicYear !== undefined && {
      academic_year: value.academicYear,
    }),

    ...(value.classTeacherId !== undefined && {
      class_teacher_id: value.classTeacherId,
    }),
  };
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
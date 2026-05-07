// src/modules/student/student.mapper.ts

import {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentIdParam,
  studentSchema,
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (explicit Prisma-aligned)
 * =========================
 */
export type StudentDB = {
  id: string;

  school_id: string;
  class_id: string;

  admission_number: string | null;
  full_name: string;
  gender: string | null;
  date_of_birth: Date | null;

  guardian_name: string | null;
  guardian_phone: string | null;

  is_active: boolean;

  created_at: Date;
  updated_at: Date;

  // relations (optional if ever selected)
  assessments?: unknown[];
  insights?: unknown[];
  classes?: unknown;
  schools?: unknown;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toStudentResponse = (db: StudentDB): Student => {
  const mapped: Student = {
    id: db.id,
    schoolId: db.school_id,
    classId: db.class_id,

    admissionNumber: db.admission_number ?? undefined,
    fullName: db.full_name,
    gender: db.gender ?? undefined,
    dateOfBirth: db.date_of_birth ?? undefined,

    guardianName: db.guardian_name ?? undefined,
    guardianPhone: db.guardian_phone ?? undefined,

    isActive: db.is_active,

    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };

  const { error, value } = studentSchema.validate(mapped);
  if (error) {
    throw new Error(`Student mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toStudentListResponse = (rows: StudentDB[]): Student[] => {
  return rows.map(toStudentResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateStudentDB = (input: CreateStudentInput) => {
  const { error, value } = createStudentSchema.validate(input);
  if (error) {
    throw new Error(`Invalid create student payload: ${error.message}`);
  }

  return {
    school_id: value.schoolId,
    class_id: value.classId,

    admission_number: value.admissionNumber ?? null,
    full_name: value.fullName,
    gender: value.gender ?? null,
    date_of_birth: value.dateOfBirth ?? null,

    guardian_name: value.guardianName ?? null,
    guardian_phone: value.guardianPhone ?? null,

    is_active: value.isActive ?? true,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateStudentDB = (input: UpdateStudentInput) => {
  const { error, value } = updateStudentSchema.validate(input);
  if (error) {
    throw new Error(`Invalid update student payload: ${error.message}`);
  }

  const update: Partial<StudentDB> = {};

  if (value.classId !== undefined) update.class_id = value.classId;
  if (value.admissionNumber !== undefined)
    update.admission_number = value.admissionNumber;

  if (value.fullName !== undefined) update.full_name = value.fullName;
  if (value.gender !== undefined) update.gender = value.gender;

  if (value.dateOfBirth !== undefined)
    update.date_of_birth = value.dateOfBirth;

  if (value.guardianName !== undefined)
    update.guardian_name = value.guardianName;

  if (value.guardianPhone !== undefined)
    update.guardian_phone = value.guardianPhone;

  if (value.isActive !== undefined) update.is_active = value.isActive;

  // Prisma @updatedAt handles this, but safe if using raw queries
  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toStudentId = (params: StudentIdParam): string => {
  const { error, value } = studentIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid student ID param: ${error.message}`);
  }

  return value.id;
};
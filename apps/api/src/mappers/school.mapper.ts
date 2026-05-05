// src/modules/school/school.mapper.ts

import {
  CreateSchoolInput,
  createSchoolSchema,
  School,
  SchoolIdParam,
  schoolIdParamSchema,
  schoolSchema,
  UpdateSchoolInput,
  updateSchoolSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (explicit, no any)
 * =========================
 */
type SchoolDB = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_plan: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
};

/**
 * =========================
 * DB → API (matches schoolSchema)
 * =========================
 */
export const toSchoolResponse = (db: SchoolDB): School => {
  const mapped: School = {
    id: db.id,
    name: db.name,
    email: db.email,
    phone: db.phone,
    address: db.address,
    subscriptionPlan: db.subscription_plan,
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at ?? undefined,
    deletedAt: db.deleted_at ?? undefined,
  };

  const { error, value } = schoolSchema.validate(mapped);
  if (error) {
    throw new Error(`School mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → API[]
 * =========================
 */
export const toSchoolListResponse = (rows: SchoolDB[]): School[] => {
  return rows.map(toSchoolResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateSchoolDB = (
  input: CreateSchoolInput,
): Omit<SchoolDB, "id" | "created_at" | "updated_at" | "deleted_at"> => {
  const { error, value } = createSchoolSchema.validate(input);
  if (error) {
    throw new Error(`Invalid create payload: ${error.message}`);
  }

  return {
    name: value.name,
    email: value.email,
    phone: value.phone,
    address: value.address,
    subscription_plan: value.subscriptionPlan,
    is_active: true,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateSchoolDB = (
  input: UpdateSchoolInput,
): Partial<Omit<SchoolDB, "id" | "created_at" | "deleted_at">> & {
  updated_at: Date;
} => {
  const { error, value } = updateSchoolSchema.validate(input);
  if (error) {
    throw new Error(`Invalid update payload: ${error.message}`);
  }

  const update: Partial<Omit<SchoolDB, "id" | "created_at" | "deleted_at">> =
    {};

  if (value.name !== undefined) update.name = value.name;
  if (value.email !== undefined) update.email = value.email;
  if (value.phone !== undefined) update.phone = value.phone;
  if (value.address !== undefined) update.address = value.address;

  if (value.subscriptionPlan !== undefined) {
    update.subscription_plan = value.subscriptionPlan;
  }

  if (value.isActive !== undefined) {
    update.is_active = value.isActive;
  }

  return {
    ...update,
    updated_at: new Date(),
  };
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toSchoolId = (params: SchoolIdParam): string => {
  const { error, value } = schoolIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid ID param: ${error.message}`);
  }

  return value.id;
};

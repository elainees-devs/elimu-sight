// src/modules/user/user.mapper.ts

import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
  userSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (explicit)
 * =========================
 */
export type UserDB = {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  school_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toUserResponse = (db: UserDB): User => {
  const mapped: User = {
    id: db.id,
    fullName: db.full_name,
    email: db.email,
    role: db.role,
    schoolId: db.school_id,
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at ?? undefined,
  };

  const { error, value } = userSchema.validate(mapped);
  if (error) {
    throw new Error(`User mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toUserListResponse = (rows: UserDB[]): User[] => {
  return rows.map(toUserResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateUserDB = (
  input: CreateUserInput & { passwordHash: string }
) => {
  const { error, value } = createUserSchema.validate(input);
  if (error) {
    throw new Error(`Invalid create user payload: ${error.message}`);
  }

  return {
    full_name: value.fullName,
    email: value.email,
    role: value.role,
    school_id: value.schoolId,
    password_hash: input.passwordHash,
    is_active: true,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateUserDB = (input: UpdateUserInput) => {
  const { error, value } = updateUserSchema.validate(input);
  if (error) {
    throw new Error(`Invalid update user payload: ${error.message}`);
  }

  const update: Partial<{
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
    updated_at: Date;
  }> = {};

  if (value.fullName !== undefined) update.full_name = value.fullName;
  if (value.email !== undefined) update.email = value.email;
  if (value.role !== undefined) update.role = value.role;
  if (value.isActive !== undefined) update.is_active = value.isActive;

  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toUserId = (params: UserIdParam): string => {
  const { error, value } = userIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid user ID param: ${error.message}`);
  }

  return value.id;
};
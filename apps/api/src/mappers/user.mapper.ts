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
 * DB TYPE (MATCHES PRISMA)
 * =========================
 */
export type UserDB = {
  id: string;

  school_id: string;
  full_name: string;
  email: string;
  password_hash: string;

  role: string;

  assigned_class_id: string | null;

  is_active: boolean;

  created_at: Date;
  updated_at: Date;

  teacher?: unknown;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toUserResponse = (db: UserDB): User => {
  const mapped: User = {
    id: db.id,

    schoolId: db.school_id,
    fullName: db.full_name,
    email: db.email,

    role: db.role,

    assignedClassId: db.assigned_class_id ?? undefined,

    isActive: db.is_active,

    createdAt: db.created_at,
    updatedAt: db.updated_at,
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
    school_id: value.schoolId,
    full_name: value.fullName,
    email: value.email,
    role: value.role,

    password_hash: input.passwordHash,

    assigned_class_id: value.assignedClassId ?? null,

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

  const update: Record<string, unknown> = {};

  if (value.fullName !== undefined) update.full_name = value.fullName;
  if (value.email !== undefined) update.email = value.email;
  if (value.role !== undefined) update.role = value.role;

  if (value.assignedClassId !== undefined) {
    update.assigned_class_id = value.assignedClassId;
  }

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
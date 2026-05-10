import { Decimal } from "@prisma/client/runtime/library";

import {
  Insight,
  CreateInsightInput,
  UpdateInsightInput,
  InsightIdParam,
  insightSchema,
  createInsightSchema,
  updateInsightSchema,
  insightIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (matches Prisma exactly)
 * =========================
 */
export type InsightDB = {
  id: string;

  school_id: string;
  class_id: string;
  student_id: string;
  subject_id: string;

  type: string | null;
  title: string | null;
  summary: string | null;

  data: unknown | null;

  confidence_score: Decimal | null;

  generated_by: string | null;
  period: string | null;

  created_at: Date;
  updated_at: Date;
};

/**
 * =========================
 * DB → DOMAIN (API RESPONSE)
 * =========================
 */
export const toInsightResponse = (db: InsightDB): Insight => {
  const mapped: Insight = {
    id: db.id,

    schoolId: db.school_id,
    classId: db.class_id,
    studentId: db.student_id,
    subjectId: db.subject_id,

    type: db.type ?? undefined,
    title: db.title ?? undefined,
    summary: db.summary ?? undefined,

    data: db.data ?? undefined,

    confidenceScore: db.confidence_score ? Number(db.confidence_score) : undefined,

    generatedBy: db.generated_by ?? undefined,
    period: db.period ?? undefined,

    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };

  const { error, value } = insightSchema.validate(mapped);
  if (error) {
    throw new Error(`Insight mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toInsightListResponse = (rows: InsightDB[]): Insight[] => {
  return rows.map(toInsightResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateInsightDB = (input: CreateInsightInput) => {
  const { error, value } = createInsightSchema.validate(input);
  if (error) {
    throw new Error(`Invalid create insight payload: ${error.message}`);
  }

  return {
    school_id: value.schoolId,
    class_id: value.classId,
    student_id: value.studentId,
    subject_id: value.subjectId,

    type: value.type ?? null,
    title: value.title ?? null,
    summary: value.summary ?? null,

    data: value.data ?? null,

    confidence_score: value.confidenceScore ?? null,

    generated_by: value.generatedBy ?? null,
    period: value.period ?? null,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateInsightDB = (input: UpdateInsightInput) => {
  const { error, value } = updateInsightSchema.validate(input);
  if (error) {
    throw new Error(`Invalid update insight payload: ${error.message}`);
  }

  const update: Record<string, unknown> = {};

  if (value.type !== undefined) update.type = value.type;
  if (value.title !== undefined) update.title = value.title;
  if (value.summary !== undefined) update.summary = value.summary;

  if (value.data !== undefined) update.data = value.data;

  if (value.confidenceScore !== undefined) {
    update.confidence_score = value.confidenceScore;
  }

  if (value.generatedBy !== undefined) {
    update.generated_by = value.generatedBy;
  }

  if (value.period !== undefined) update.period = value.period;

  update.updated_at = new Date();

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toInsightId = (params: InsightIdParam): string => {
  const { error, value } = insightIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid insight ID param: ${error.message}`);
  }

  return value.id;
};
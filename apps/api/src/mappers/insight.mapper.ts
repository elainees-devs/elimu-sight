// src/modules/insight/insight.mapper.ts

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
 * DB TYPE (explicit)
 * =========================
 */
export type InsightDB = {
  id: string;

  school_id: string;
  class_id: string | null;
  student_id: string | null;
  subject_id: string | null;

  type: string;
  title: string;
  summary: string | null;

  data: Record<string, unknown> | null;

  confidence_score: number | null;

  generated_by: string;
  period: string | null;

  created_at: Date;
  updated_at: Date | null;
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
    classId: db.class_id ?? undefined,
    studentId: db.student_id ?? undefined,
    subjectId: db.subject_id ?? undefined,

    type: db.type as Insight["type"],
    title: db.title,
    summary: db.summary ?? undefined,

    data: db.data ?? undefined,

    confidenceScore: db.confidence_score ?? undefined,

    generatedBy: db.generated_by as Insight["generatedBy"],
    period: db.period ?? undefined,

    createdAt: db.created_at,
    updatedAt: db.updated_at ?? undefined,
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
export const toInsightListResponse = (
  rows: InsightDB[]
): Insight[] => {
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
    class_id: value.classId ?? null,
    student_id: value.studentId ?? null,
    subject_id: value.subjectId ?? null,

    type: value.type,
    title: value.title,
    summary: value.summary ?? null,

    data: value.data ?? null,

    confidence_score: value.confidenceScore ?? null,

    generated_by: value.generatedBy,
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

  if (value.title !== undefined) update.title = value.title;
  if (value.summary !== undefined) update.summary = value.summary;
  if (value.data !== undefined) update.data = value.data;
  if (value.confidenceScore !== undefined)
    update.confidence_score = value.confidenceScore;

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
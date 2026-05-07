import { Decimal } from "@prisma/client/runtime/library";

import {
  Assessment,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AssessmentIdParam,
  assessmentSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  assessmentIdParamSchema,
} from "schemas";

/**
 * =========================
 * DB TYPE (STRICT)
 * =========================
 */
export type AssessmentDB = {
  id: string;
  school_id: string;
  class_id: string;
  student_id: string;
  subject_id: string;
  created_by: string;
  term: string;
  exam_type: string;
  score: Decimal; // Prisma Decimal
  total_marks: Decimal; // Prisma Decimal
  grade: string;
  remarks: string;
  created_at: Date;
};

/**
 * =========================
 * DB → DOMAIN
 * =========================
 */
export const toAssessmentResponse = (db: AssessmentDB): Assessment => {
  const mapped: Assessment = {
    id: db.id,
    schoolId: db.school_id,
    classId: db.class_id,
    studentId: db.student_id,
    subjectId: db.subject_id,
    createdBy: db.created_by,
    term: db.term,
    examType: db.exam_type,
    score: Number(db.score),
    totalMarks: Number(db.total_marks),
    grade: db.grade,
    remarks: db.remarks,
    createdAt: db.created_at,
  };

  const { error, value } = assessmentSchema.validate(mapped);
  if (error) {
    throw new Error(`Assessment mapping failed: ${error.message}`);
  }

  return value;
};

/**
 * =========================
 * DB[] → DOMAIN[]
 * =========================
 */
export const toAssessmentListResponse = (rows: AssessmentDB[]): Assessment[] => {
  return rows.map(toAssessmentResponse);
};

/**
 * =========================
 * INPUT → DB (CREATE)
 * =========================
 */
export const toCreateAssessmentDB = (input: CreateAssessmentInput) => {
  const { error, value } = createAssessmentSchema.validate(input);

  if (error) {
    throw new Error(`Invalid create assessment payload: ${error.message}`);
  }

  return {
    school_id: value.schoolId,
    class_id: value.classId,
    student_id: value.studentId,
    subject_id: value.subjectId,
    created_by: value.createdBy,
    term: value.term,
    exam_type: value.examType,
    score: value.score,
    total_marks: value.totalMarks,
    grade: value.grade,
    remarks: value.remarks,
  };
};

/**
 * =========================
 * INPUT → DB (UPDATE)
 * =========================
 */
export const toUpdateAssessmentDB = (input: UpdateAssessmentInput) => {
  const { error, value } = updateAssessmentSchema.validate(input);

  if (error) {
    throw new Error(`Invalid update assessment payload: ${error.message}`);
  }

  const update: Record<string, unknown> = {};

  if (value.term !== undefined) update.term = value.term;
  if (value.examType !== undefined) update.exam_type = value.examType;

  if (value.score !== undefined) update.score = value.score;
  if (value.totalMarks !== undefined) update.total_marks = value.totalMarks;

  if (value.grade !== undefined) update.grade = value.grade;
  if (value.remarks !== undefined) update.remarks = value.remarks;

  return update;
};

/**
 * =========================
 * PARAM → SAFE ID
 * =========================
 */
export const toAssessmentId = (params: AssessmentIdParam): string => {
  const { error, value } = assessmentIdParamSchema.validate(params);

  if (error) {
    throw new Error(`Invalid assessment ID param: ${error.message}`);
  }

  return value.id;
};
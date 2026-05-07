import { Request } from "express";

// ===============================
// ID PARAM
// ===============================
export const toIdParam = (req: Request) => ({
  id: Number(req.params.id),
});

// ===============================
// SCHOOL ID PARAM
// ===============================
export const toSchoolIdParam = (req: Request) => ({
  schoolId: req.params.schoolId as string,
});

// ===============================
// CLASS ID PARAM
// ===============================
export const toClassIdParam = (req: Request) => ({
  classId: req.params.classId as string,
});

// ===============================
// SUBJECT ID PARAM

export const toSubjectIdParam = (req: Request) => ({
  subjectId: req.params.subjectId as string,
});

// ===============================
// STUDENT ID PARAM
// ===============================
export const toStudentIdParam = (req: Request) => ({
 studentId: req.params.studentId as string,
});

// EMAIL PARAM

export const toEmailParam = (req: Request) => ({
  email: req.params.email as string,
});

// NAME PARAM

export const toNameParam = (req: Request) => ({
  name: req.params.name as string,
});
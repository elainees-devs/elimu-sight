/*
  Warnings:

  - Made the column `term` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exam_type` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_marks` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grade` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remarks` on table `assessments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "assessments" ALTER COLUMN "term" SET NOT NULL,
ALTER COLUMN "exam_type" SET NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "total_marks" SET NOT NULL,
ALTER COLUMN "grade" SET NOT NULL,
ALTER COLUMN "remarks" SET NOT NULL;

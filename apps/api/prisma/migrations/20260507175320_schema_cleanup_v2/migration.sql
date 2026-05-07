/*
  Warnings:

  - Made the column `school_id` on table `ai_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `ai_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_id` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `student_id` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject_id` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_id` on table `class_subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject_id` on table `class_subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `class_subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_id` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `student_id` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject_id` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `insights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_id` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `subjects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school_id` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ai_logs" DROP CONSTRAINT "ai_logs_school_id_fkey";

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_created_by_fkey";

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_school_id_fkey";

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_class_id_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_class_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_school_id_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_class_id_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_school_id_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_student_id_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_class_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_school_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_school_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_school_id_fkey";

-- AlterTable
ALTER TABLE "ai_logs" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "assessments" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "class_id" SET NOT NULL,
ALTER COLUMN "student_id" SET NOT NULL,
ALTER COLUMN "subject_id" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "class_subjects" ALTER COLUMN "class_id" SET NOT NULL,
ALTER COLUMN "subject_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "insights" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "class_id" SET NOT NULL,
ALTER COLUMN "student_id" SET NOT NULL,
ALTER COLUMN "subject_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "class_id" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_class_teacher_id_fkey" FOREIGN KEY ("class_teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_ai_logs_school_id" RENAME TO "ai_logs_school_id_idx";

-- RenameIndex
ALTER INDEX "idx_assessments_class_id" RENAME TO "assessments_class_id_idx";

-- RenameIndex
ALTER INDEX "idx_assessments_student_id" RENAME TO "assessments_student_id_idx";

-- RenameIndex
ALTER INDEX "idx_assessments_subject_id" RENAME TO "assessments_subject_id_idx";

-- RenameIndex
ALTER INDEX "idx_class_subject_class_id" RENAME TO "class_subjects_class_id_idx";

-- RenameIndex
ALTER INDEX "idx_class_subject_subject_id" RENAME TO "class_subjects_subject_id_idx";

-- RenameIndex
ALTER INDEX "idx_classes_school_id" RENAME TO "classes_school_id_idx";

-- RenameIndex
ALTER INDEX "idx_insights_class_id" RENAME TO "insights_class_id_idx";

-- RenameIndex
ALTER INDEX "idx_insights_school_id" RENAME TO "insights_school_id_idx";

-- RenameIndex
ALTER INDEX "idx_insights_student_id" RENAME TO "insights_student_id_idx";

-- RenameIndex
ALTER INDEX "idx_insights_subject_id" RENAME TO "insights_subject_id_idx";

-- RenameIndex
ALTER INDEX "idx_schools_email" RENAME TO "schools_email_idx";

-- RenameIndex
ALTER INDEX "idx_students_class_id" RENAME TO "students_class_id_idx";

-- RenameIndex
ALTER INDEX "idx_students_school_id" RENAME TO "students_school_id_idx";

-- RenameIndex
ALTER INDEX "idx_subjects_school_id" RENAME TO "subjects_school_id_idx";

-- RenameIndex
ALTER INDEX "idx_users_email" RENAME TO "users_email_idx";

-- RenameIndex
ALTER INDEX "idx_users_school_id" RENAME TO "users_school_id_idx";

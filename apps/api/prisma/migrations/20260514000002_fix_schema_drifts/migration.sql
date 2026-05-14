-- AlterTable: make level, stream, academic_year NOT NULL
ALTER TABLE "classes" ALTER COLUMN "level" SET NOT NULL;
ALTER TABLE "classes" ALTER COLUMN "stream" SET NOT NULL;
ALTER TABLE "classes" ALTER COLUMN "academic_year" SET NOT NULL;

-- AlterTable: add deleted_at column to insights
ALTER TABLE "insights" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- CreateIndex: add unique constraint on class_subjects
CREATE UNIQUE INDEX "class_subjects_class_id_subject_id_key" ON "class_subjects"("class_id", "subject_id");

-- CreateIndex: add indexes on insights
CREATE INDEX "insights_school_id_class_id_idx" ON "insights"("school_id", "class_id");
CREATE INDEX "insights_school_id_student_id_idx" ON "insights"("school_id", "student_id");
CREATE INDEX "insights_school_id_subject_id_idx" ON "insights"("school_id", "subject_id");

-- AlterTable: fix FK onDelete from RESTRICT to CASCADE
ALTER TABLE "insights"
  DROP CONSTRAINT "insights_class_id_fkey",
  DROP CONSTRAINT "insights_student_id_fkey",
  DROP CONSTRAINT "insights_subject_id_fkey";

ALTER TABLE "insights"
  ADD CONSTRAINT "insights_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "insights_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "insights_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

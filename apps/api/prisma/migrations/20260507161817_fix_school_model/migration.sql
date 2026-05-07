/*
  Warnings:

  - Made the column `email` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscription_plan` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `schools` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "subscription_plan" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" DROP DEFAULT,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

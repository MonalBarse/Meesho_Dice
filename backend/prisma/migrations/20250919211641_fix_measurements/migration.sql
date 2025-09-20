/*
  Warnings:

  - Made the column `height` on table `UserMeasurement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."UserMeasurement" ALTER COLUMN "height" SET NOT NULL;

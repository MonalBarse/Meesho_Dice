/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CertaintyScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductMeasurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMeasurement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CertaintyScore" DROP CONSTRAINT "CertaintyScore_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductMeasurement" DROP CONSTRAINT "ProductMeasurement_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserMeasurement" DROP CONSTRAINT "UserMeasurement_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."CertaintyScore";

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."ProductMeasurement";

-- DropTable
DROP TABLE "public"."UserMeasurement";

-- CreateTable
CREATE TABLE "public"."UserMeasurements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bust" DOUBLE PRECISION NOT NULL,
    "waist" DOUBLE PRECISION NOT NULL,
    "hip" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserMeasurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fitCategory" TEXT NOT NULL,
    "chest" DOUBLE PRECISION NOT NULL,
    "waist" DOUBLE PRECISION NOT NULL,
    "hip" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMeasurements_userId_key" ON "public"."UserMeasurements"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserMeasurements" ADD CONSTRAINT "UserMeasurements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

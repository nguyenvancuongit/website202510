/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - The `type` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CategoryStatus" AS ENUM ('enabled', 'disabled');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('latestNew', 'product', 'solution', 'caseStudy');

-- DropIndex
DROP INDEX "public"."categories_slug_key";

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "description",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "published_post" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."CategoryType" NOT NULL DEFAULT 'latestNew',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."CategoryStatus" NOT NULL DEFAULT 'enabled';

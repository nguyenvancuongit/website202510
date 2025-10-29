/*
  Warnings:

  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_permissions" DROP CONSTRAINT "user_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_permissions" DROP CONSTRAINT "user_permissions_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "permissions" TEXT[];

-- DropTable
DROP TABLE "public"."permissions";

-- DropTable
DROP TABLE "public"."user_permissions";

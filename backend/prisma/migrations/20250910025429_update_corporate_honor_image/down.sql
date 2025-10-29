-- DropForeignKey
ALTER TABLE "public"."corporate_honors" DROP CONSTRAINT "corporate_honors_image_id_fkey";

-- AlterTable
ALTER TABLE "public"."corporate_honors" DROP COLUMN "image_id",
ADD COLUMN     "image" VARCHAR(500);


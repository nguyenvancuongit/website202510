/*
  Warnings:

  - You are about to drop the column `image` on the `corporate_honors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."corporate_honors" DROP COLUMN "image",
ADD COLUMN     "image_id" BIGINT;

-- AddForeignKey
ALTER TABLE "public"."corporate_honors" ADD CONSTRAINT "corporate_honors_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

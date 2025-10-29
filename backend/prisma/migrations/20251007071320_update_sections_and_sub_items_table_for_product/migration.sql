/*
  Warnings:

  - You are about to drop the column `sort_order` on the `section_sub_items` table. All the data in the column will be lost.
  - You are about to drop the column `section_image_position` on the `sections` table. All the data in the column will be lost.
  - Added the required column `section_type` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('intro', 'featured_grid', 'icon_list', 'tab_content', 'section_with_subtitle_image', 'card_list', 'image_to_text', 'featured_list_to_image');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."section_sub_items" DROP COLUMN "sort_order",
ADD COLUMN     "cta_icon_media_id" BIGINT,
ADD COLUMN     "cta_text" VARCHAR(100),
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."sections" DROP COLUMN "section_image_position",
ADD COLUMN     "cta_link" VARCHAR(500),
ADD COLUMN     "cta_text" VARCHAR(100) NOT NULL DEFAULT '合作咨询',
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "section_image_description" TEXT,
ADD COLUMN     "section_image_title" VARCHAR(255),
ADD COLUMN     "section_type" "public"."SectionType" NOT NULL,
ADD COLUMN     "sub_description" TEXT,
ADD COLUMN     "sub_title" VARCHAR(255),
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."section_sub_items" ADD CONSTRAINT "section_sub_items_cta_icon_media_id_fkey" FOREIGN KEY ("cta_icon_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

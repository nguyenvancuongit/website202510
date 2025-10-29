-- DropForeignKey
ALTER TABLE "public"."medias" DROP CONSTRAINT "medias_upload_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_banner_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."solutions" DROP CONSTRAINT "solutions_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."solutions" DROP CONSTRAINT "solutions_banner_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_solution_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_section_image_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."section_sub_items" DROP CONSTRAINT "section_sub_items_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."section_sub_items" DROP CONSTRAINT "section_sub_items_sub_item_image_media_id_fkey";

-- AlterTable
ALTER TABLE "public"."medias" DROP COLUMN "upload_by";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."solutions";

-- DropTable
DROP TABLE "public"."sections";

-- DropTable
DROP TABLE "public"."section_sub_items";

-- DropEnum
DROP TYPE "public"."ProductStatus";

-- DropEnum
DROP TYPE "public"."SolutionStatus";

-- DropEnum
DROP TYPE "public"."SectionImagePosition";


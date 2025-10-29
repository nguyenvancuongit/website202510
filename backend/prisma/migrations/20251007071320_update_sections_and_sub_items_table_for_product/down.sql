-- DropForeignKey
ALTER TABLE "public"."section_sub_items" DROP CONSTRAINT "section_sub_items_cta_icon_media_id_fkey";

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "public"."sections" DROP COLUMN "cta_link",
DROP COLUMN "cta_text",
DROP COLUMN "is_active",
DROP COLUMN "section_image_description",
DROP COLUMN "section_image_title",
DROP COLUMN "section_type",
DROP COLUMN "sub_description",
DROP COLUMN "sub_title",
ADD COLUMN     "section_image_position" "public"."SectionImagePosition" DEFAULT 'top',
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."section_sub_items" DROP COLUMN "cta_icon_media_id",
DROP COLUMN "cta_text",
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- DropEnum
DROP TYPE "public"."SectionType";


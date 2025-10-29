-- DropForeignKey
ALTER TABLE "public"."banners" DROP CONSTRAINT "banners_web_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."banners" DROP CONSTRAINT "banners_mobile_media_id_fkey";

-- DropIndex
DROP INDEX "public"."banners_web_media_id_key";

-- DropIndex
DROP INDEX "public"."banners_mobile_media_id_key";

-- AlterTable
ALTER TABLE "public"."banners" DROP COLUMN "mobile_media_id",
DROP COLUMN "web_media_id",
ADD COLUMN     "image_url" VARCHAR(500),
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "public"."medias";

-- DropEnum
DROP TYPE "public"."BannerStatus";

-- DropEnum
DROP TYPE "public"."MediaType";


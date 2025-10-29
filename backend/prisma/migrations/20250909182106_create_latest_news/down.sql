-- DropForeignKey
ALTER TABLE "public"."latest_news" DROP CONSTRAINT "latest_news_web_thumbnail_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."latest_news" DROP CONSTRAINT "latest_news_mobile_thumbnail_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."latest_news" DROP CONSTRAINT "latest_news_category_id_fkey";

-- DropTable
DROP TABLE "public"."latest_news";

-- DropEnum
DROP TYPE "public"."LatestNewStatus";


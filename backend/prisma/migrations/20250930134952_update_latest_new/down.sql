-- DropForeignKey
ALTER TABLE "public"."latest_news" DROP CONSTRAINT "latest_news_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."latest_news" DROP CONSTRAINT "latest_news_updated_by_fkey";

-- AlterTable
ALTER TABLE "public"."latest_news" DROP COLUMN "published_date";


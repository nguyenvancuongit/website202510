-- CreateEnum
CREATE TYPE "public"."LatestNewStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateTable
CREATE TABLE "public"."latest_news" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" "public"."LatestNewStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "web_thumbnail_media_id" BIGINT,
    "mobile_thumbnail_media_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" BIGINT,
    "updated_by" BIGINT,

    CONSTRAINT "latest_news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_title_key" ON "public"."latest_news"("title");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_slug_key" ON "public"."latest_news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_web_thumbnail_media_id_key" ON "public"."latest_news"("web_thumbnail_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_mobile_thumbnail_media_id_key" ON "public"."latest_news"("mobile_thumbnail_media_id");

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_web_thumbnail_media_id_fkey" FOREIGN KEY ("web_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_mobile_thumbnail_media_id_fkey" FOREIGN KEY ("mobile_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

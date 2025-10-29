-- CreateEnum
CREATE TYPE "public"."CaseStudyStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateTable
CREATE TABLE "public"."case_studies" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" "public"."CaseStudyStatus" NOT NULL,
    "content" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "web_thumbnail_media_id" BIGINT,
    "mobile_thumbnail_media_id" BIGINT,
    "customer_name" VARCHAR(255),
    "customer_logo_media_id" BIGINT,
    "key_highlights" TEXT[],
    "highlight_description" TEXT,
    "customer_feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" BIGINT,
    "updated_by" BIGINT,

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_title_key" ON "public"."case_studies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_key" ON "public"."case_studies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_web_thumbnail_media_id_key" ON "public"."case_studies"("web_thumbnail_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_mobile_thumbnail_media_id_key" ON "public"."case_studies"("mobile_thumbnail_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_customer_logo_media_id_key" ON "public"."case_studies"("customer_logo_media_id");

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_web_thumbnail_media_id_fkey" FOREIGN KEY ("web_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_mobile_thumbnail_media_id_fkey" FOREIGN KEY ("mobile_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_customer_logo_media_id_fkey" FOREIGN KEY ("customer_logo_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

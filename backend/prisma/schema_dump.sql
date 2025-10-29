-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."CategoryStatus" AS ENUM ('enabled', 'disabled');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('latestNew', 'product', 'solution', 'caseStudy');

-- CreateEnum
CREATE TYPE "public"."BannerStatus" AS ENUM ('enabled', 'disabled');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('image', 'video', 'audio', 'document');

-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('pending', 'active', 'disabled');

-- CreateEnum
CREATE TYPE "public"."LatestNewStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "public"."CaseStudyStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "public"."SolutionStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "public"."OperationStatus" AS ENUM ('success', 'failed');

-- CreateEnum
CREATE TYPE "public"."SectionImagePosition" AS ENUM ('top', 'left', 'bottom', 'right');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phone" VARCHAR(20),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "published_post" INTEGER NOT NULL DEFAULT 0,
    "type" "public"."CategoryType" NOT NULL DEFAULT 'latestNew',
    "status" "public"."CategoryStatus" NOT NULL DEFAULT 'enabled',

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "author_id" BIGINT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "caption" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "imageable_id" BIGINT NOT NULL,
    "imageable_type" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banners" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255),
    "link_url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mobile_media_id" BIGINT,
    "web_media_id" BIGINT,
    "status" "public"."BannerStatus" NOT NULL DEFAULT 'enabled',

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."friend_links" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friend_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "company" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "request_note" TEXT,
    "title" VARCHAR(255),
    "address" VARCHAR(255),
    "cooperation_requirements" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "cooperation_types" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "submit_source" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" BIGSERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'string',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hashtags" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_hashtags" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "hashtag_id" BIGINT NOT NULL,

    CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medias" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "path" VARCHAR(500) NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "size" INTEGER NOT NULL,
    "alt_text" VARCHAR(255),
    "caption" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "upload_by" BIGINT,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "phone_number" VARCHAR(20),
    "full_name" VARCHAR(255),
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "status" "public"."ClientStatus" NOT NULL DEFAULT 'pending',
    "last_login_time" TIMESTAMP(3),
    "email_verification_code" VARCHAR(6),
    "email_verification_expires" TIMESTAMP(3),
    "password_reset_token" VARCHAR(255),
    "password_reset_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."corporate_honors" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "obtained_date" TIMESTAMP(3) NOT NULL,
    "author_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "image_id" BIGINT,

    CONSTRAINT "corporate_honors_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."operation_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "operation_type" VARCHAR(100) NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "operation_desc" VARCHAR(500) NOT NULL,
    "target_type" VARCHAR(100),
    "target_id" VARCHAR(100),
    "status" "public"."OperationStatus" NOT NULL DEFAULT 'success',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "banner_media_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solutions" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."SolutionStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "banner_media_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sections" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "product_id" BIGINT,
    "solution_id" BIGINT,
    "section_image_media_id" BIGINT,
    "section_image_position" "public"."SectionImagePosition" DEFAULT 'top',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."section_sub_items" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "section_id" BIGINT NOT NULL,
    "sub_item_image_media_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_sub_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "public"."posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "banners_mobile_media_id_key" ON "public"."banners"("mobile_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "banners_web_media_id_key" ON "public"."banners"("web_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "hashtags_name_key" ON "public"."hashtags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_hashtags_post_id_hashtag_id_key" ON "public"."post_hashtags"("post_id", "hashtag_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "public"."permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "public"."user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_number_key" ON "public"."clients"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "public"."clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_password_reset_token_key" ON "public"."clients"("password_reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_title_key" ON "public"."latest_news"("title");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_slug_key" ON "public"."latest_news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_web_thumbnail_media_id_key" ON "public"."latest_news"("web_thumbnail_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "latest_news_mobile_thumbnail_media_id_key" ON "public"."latest_news"("mobile_thumbnail_media_id");

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

-- CreateIndex
CREATE INDEX "operation_logs_user_id_idx" ON "public"."operation_logs"("user_id");

-- CreateIndex
CREATE INDEX "operation_logs_module_idx" ON "public"."operation_logs"("module");

-- CreateIndex
CREATE INDEX "operation_logs_operation_type_idx" ON "public"."operation_logs"("operation_type");

-- CreateIndex
CREATE INDEX "operation_logs_status_idx" ON "public"."operation_logs"("status");

-- CreateIndex
CREATE INDEX "operation_logs_created_at_idx" ON "public"."operation_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "public"."products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "solutions_slug_key" ON "public"."solutions"("slug");

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_imageable_id_fkey" FOREIGN KEY ("imageable_id") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_mobile_media_id_fkey" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_web_media_id_fkey" FOREIGN KEY ("web_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_hashtags" ADD CONSTRAINT "post_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_hashtags" ADD CONSTRAINT "post_hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medias" ADD CONSTRAINT "medias_upload_by_fkey" FOREIGN KEY ("upload_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corporate_honors" ADD CONSTRAINT "corporate_honors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corporate_honors" ADD CONSTRAINT "corporate_honors_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_mobile_thumbnail_media_id_fkey" FOREIGN KEY ("mobile_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_web_thumbnail_media_id_fkey" FOREIGN KEY ("web_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_customer_logo_media_id_fkey" FOREIGN KEY ("customer_logo_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_mobile_thumbnail_media_id_fkey" FOREIGN KEY ("mobile_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_studies" ADD CONSTRAINT "case_studies_web_thumbnail_media_id_fkey" FOREIGN KEY ("web_thumbnail_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_logs" ADD CONSTRAINT "operation_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_banner_media_id_fkey" FOREIGN KEY ("banner_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_banner_media_id_fkey" FOREIGN KEY ("banner_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sections" ADD CONSTRAINT "sections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sections" ADD CONSTRAINT "sections_section_image_media_id_fkey" FOREIGN KEY ("section_image_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sections" ADD CONSTRAINT "sections_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."section_sub_items" ADD CONSTRAINT "section_sub_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."section_sub_items" ADD CONSTRAINT "section_sub_items_sub_item_image_media_id_fkey" FOREIGN KEY ("sub_item_image_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;


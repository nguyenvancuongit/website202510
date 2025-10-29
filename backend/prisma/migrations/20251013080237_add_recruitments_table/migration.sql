-- CreateEnum
CREATE TYPE "public"."RecruitmentPostTypeStatus" AS ENUM ('enabled', 'disabled');

-- CreateEnum
CREATE TYPE "public"."RecruitmentPostStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('full_time', 'internship');

-- CreateTable
CREATE TABLE "public"."recruitment_post_types" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" "public"."RecruitmentPostTypeStatus" NOT NULL DEFAULT 'enabled',
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruitment_post_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recruitment_posts" (
    "id" BIGSERIAL NOT NULL,
    "job_title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "job_description" TEXT NOT NULL,
    "recruitment_post_type_id" BIGINT NOT NULL,
    "job_type" "public"."JobType" NOT NULL DEFAULT 'full_time',
    "status" "public"."RecruitmentPostStatus" NOT NULL DEFAULT 'draft',
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruitment_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resume_applications" (
    "id" BIGSERIAL NOT NULL,
    "recruitment_post_id" BIGINT NOT NULL,
    "resume_file_path" VARCHAR(500),
    "resume_file_name" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recruitment_post_types_slug_key" ON "public"."recruitment_post_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "recruitment_posts_slug_key" ON "public"."recruitment_posts"("slug");

-- AddForeignKey
ALTER TABLE "public"."recruitment_post_types" ADD CONSTRAINT "recruitment_post_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recruitment_post_types" ADD CONSTRAINT "recruitment_post_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recruitment_posts" ADD CONSTRAINT "recruitment_posts_recruitment_post_type_id_fkey" FOREIGN KEY ("recruitment_post_type_id") REFERENCES "public"."recruitment_post_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recruitment_posts" ADD CONSTRAINT "recruitment_posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recruitment_posts" ADD CONSTRAINT "recruitment_posts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resume_applications" ADD CONSTRAINT "resume_applications_recruitment_post_id_fkey" FOREIGN KEY ("recruitment_post_id") REFERENCES "public"."recruitment_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

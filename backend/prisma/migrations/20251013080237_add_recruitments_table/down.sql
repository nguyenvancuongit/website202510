-- DropForeignKey
ALTER TABLE "public"."recruitment_post_types" DROP CONSTRAINT "recruitment_post_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."recruitment_post_types" DROP CONSTRAINT "recruitment_post_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."recruitment_posts" DROP CONSTRAINT "recruitment_posts_recruitment_post_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recruitment_posts" DROP CONSTRAINT "recruitment_posts_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."recruitment_posts" DROP CONSTRAINT "recruitment_posts_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."resume_applications" DROP CONSTRAINT "resume_applications_recruitment_post_id_fkey";

-- DropTable
DROP TABLE "public"."recruitment_post_types";

-- DropTable
DROP TABLE "public"."recruitment_posts";

-- DropTable
DROP TABLE "public"."resume_applications";

-- DropEnum
DROP TYPE "public"."RecruitmentPostTypeStatus";

-- DropEnum
DROP TYPE "public"."RecruitmentPostStatus";

-- DropEnum
DROP TYPE "public"."JobType";


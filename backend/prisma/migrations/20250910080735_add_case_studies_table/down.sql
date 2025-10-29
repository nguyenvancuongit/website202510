-- DropForeignKey
ALTER TABLE "public"."case_studies" DROP CONSTRAINT "case_studies_web_thumbnail_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."case_studies" DROP CONSTRAINT "case_studies_mobile_thumbnail_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."case_studies" DROP CONSTRAINT "case_studies_customer_logo_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."case_studies" DROP CONSTRAINT "case_studies_category_id_fkey";

-- DropTable
DROP TABLE "public"."case_studies";

-- DropEnum
DROP TYPE "public"."CaseStudyStatus";


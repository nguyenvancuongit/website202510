-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."posts" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."latest_news" ADD COLUMN     "published_date" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."latest_news" ADD CONSTRAINT "latest_news_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

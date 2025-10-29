/*
  Warnings:

  - You are about to drop the column `image_url` on the `banners` table. All the data in the column will be lost.
  - The `status` column on the `banners` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[web_media_id]` on the table `banners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile_media_id]` on the table `banners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."BannerStatus" AS ENUM ('enabled', 'disabled');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('image', 'video', 'audio', 'document');

-- AlterTable
ALTER TABLE "public"."banners" DROP COLUMN "image_url",
ADD COLUMN     "mobile_media_id" BIGINT,
ADD COLUMN     "web_media_id" BIGINT,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."BannerStatus" NOT NULL DEFAULT 'enabled';

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

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banners_web_media_id_key" ON "public"."banners"("web_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "banners_mobile_media_id_key" ON "public"."banners"("mobile_media_id");

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_web_media_id_fkey" FOREIGN KEY ("web_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_mobile_media_id_fkey" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

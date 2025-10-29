/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "images_imageable_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_hashtags" DROP CONSTRAINT "post_hashtags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_category_id_fkey";

-- DropTable
DROP TABLE "public"."posts";

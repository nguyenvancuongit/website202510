-- AlterTable
ALTER TABLE "public"."customers" ADD COLUMN     "cooperation_type" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "request_note" TEXT,
ADD COLUMN     "title" VARCHAR(255);

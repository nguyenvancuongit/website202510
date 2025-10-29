-- AlterTable
ALTER TABLE "public"."customers"
DROP COLUMN "cooperation_type",
ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "cooperation_requirements" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "cooperation_types" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "submit_source" INTEGER NOT NULL DEFAULT 0;

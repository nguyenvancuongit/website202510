-- AlterTable
ALTER TABLE "public"."customers" DROP COLUMN "address",
DROP COLUMN "cooperation_requirements",
DROP COLUMN "cooperation_types",
DROP COLUMN "submit_source",
ADD COLUMN     "cooperation_type" INTEGER NOT NULL DEFAULT 0;


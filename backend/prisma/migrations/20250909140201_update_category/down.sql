-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "order",
DROP COLUMN "published_post",
ADD COLUMN     "description" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."CategoryStatus";

-- DropEnum
DROP TYPE "public"."CategoryType";

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug" ASC);


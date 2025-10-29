-- CreateTable
CREATE TABLE "public"."corporate_honors" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(500),
    "obtained_date" TIMESTAMP(3) NOT NULL,
    "author_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "corporate_honors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."corporate_honors" ADD CONSTRAINT "corporate_honors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

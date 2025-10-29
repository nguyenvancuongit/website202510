-- CreateEnum
CREATE TYPE "public"."OperationStatus" AS ENUM ('success', 'failed');

-- CreateTable
CREATE TABLE "public"."operation_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "operation_type" VARCHAR(100) NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "operation_desc" VARCHAR(500) NOT NULL,
    "target_type" VARCHAR(100),
    "target_id" VARCHAR(100),
    "status" "public"."OperationStatus" NOT NULL DEFAULT 'success',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operation_logs_user_id_idx" ON "public"."operation_logs"("user_id");

-- CreateIndex
CREATE INDEX "operation_logs_module_idx" ON "public"."operation_logs"("module");

-- CreateIndex
CREATE INDEX "operation_logs_operation_type_idx" ON "public"."operation_logs"("operation_type");

-- CreateIndex
CREATE INDEX "operation_logs_status_idx" ON "public"."operation_logs"("status");

-- CreateIndex
CREATE INDEX "operation_logs_created_at_idx" ON "public"."operation_logs"("created_at");

-- AddForeignKey
ALTER TABLE "public"."operation_logs" ADD CONSTRAINT "operation_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."operation_logs" ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "request_params" JSONB;

-- CreateIndex
CREATE INDEX "operation_logs_ip_address_idx" ON "public"."operation_logs"("ip_address");

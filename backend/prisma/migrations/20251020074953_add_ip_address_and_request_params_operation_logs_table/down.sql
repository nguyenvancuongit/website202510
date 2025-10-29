-- DropIndex
DROP INDEX "public"."operation_logs_ip_address_idx";

-- AlterTable
ALTER TABLE "public"."operation_logs" DROP COLUMN "ip_address",
DROP COLUMN "request_params";


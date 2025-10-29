-- DropForeignKey
ALTER TABLE "public"."operation_logs" DROP CONSTRAINT "operation_logs_user_id_fkey";

-- DropTable
DROP TABLE "public"."operation_logs";

-- DropEnum
DROP TYPE "public"."OperationStatus";


-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('pending', 'active', 'disabled');

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "phone_number" VARCHAR(20),
    "full_name" VARCHAR(255),
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "status" "public"."ClientStatus" NOT NULL DEFAULT 'pending',
    "last_login_time" TIMESTAMP(3),
    "email_verification_code" VARCHAR(6),
    "email_verification_expires" TIMESTAMP(3),
    "password_reset_token" VARCHAR(255),
    "password_reset_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_number_key" ON "public"."clients"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "public"."clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_password_reset_token_key" ON "public"."clients"("password_reset_token");

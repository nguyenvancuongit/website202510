-- Drop indexes
DROP INDEX IF EXISTS "public"."clients_password_reset_token_key";
DROP INDEX IF EXISTS "public"."clients_email_key";
DROP INDEX IF EXISTS "public"."clients_phone_number_key";

-- Drop table
DROP TABLE IF EXISTS "public"."clients";

-- Drop enum
DROP TYPE IF EXISTS "public"."ClientStatus";

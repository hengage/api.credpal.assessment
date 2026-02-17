import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionTable1771367987303 implements MigrationInterface {
    name = 'CreateTransactionTable1771367987303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('fund', 'convert', 'trade')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('success', 'failed', 'pending')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."transactions_type_enum" NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'success', "currency" character varying(3) NOT NULL, "amountMinor" bigint NOT NULL, "balanceAfterMinor" bigint NOT NULL, "toCurrency" character varying(3), "toAmountMinor" bigint, "rate" numeric(18,8), "description" text, "walletId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")); COMMENT ON COLUMN "transactions"."currency" IS 'Source currency code'; COMMENT ON COLUMN "transactions"."amountMinor" IS 'Amount in source currency minor units'; COMMENT ON COLUMN "transactions"."balanceAfterMinor" IS 'Wallet balance after transaction in minor units'; COMMENT ON COLUMN "transactions"."toCurrency" IS 'Target currency for CONVERT/TRADE'; COMMENT ON COLUMN "transactions"."toAmountMinor" IS 'Amount in target currency minor units'; COMMENT ON COLUMN "transactions"."rate" IS 'FX rate used (if applicable)'; COMMENT ON COLUMN "transactions"."description" IS 'Transaction description'`);
        await queryRunner.query(`CREATE INDEX "IDX_2c9d9548cf8410e425e120b5e6" ON "transactions" ("walletId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_a88f466d39796d3081cf96e1b66" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_a88f466d39796d3081cf96e1b66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c9d9548cf8410e425e120b5e6"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletsTable1770896429135 implements MigrationInterface {
    name = 'CreateWalletsTable1770896429135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionPin" character varying, "userId" uuid, CONSTRAINT "REL_2ecdb33f23e9a6fc392025c0b9" UNIQUE ("userId"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet_balances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "currency" character varying(3) NOT NULL, "balanceMinor" bigint NOT NULL DEFAULT '0', "walletId" uuid, CONSTRAINT "UQ_f95bfe9d167bf79ecaf43d093e7" UNIQUE ("walletId", "currency"), CONSTRAINT "PK_eebe2c6f13f1a2de3457f8a885c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_balances" ADD CONSTRAINT "FK_10560f85c13af935346bdd37dd4" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_balances" DROP CONSTRAINT "FK_10560f85c13af935346bdd37dd4"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`);
        await queryRunner.query(`DROP TABLE "wallet_balances"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
    }

}

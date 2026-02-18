import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "src/common/database/base.repository";
import { DATA_SOURCE } from "src/common/constants";
import { DataSource, EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { WalletBalance } from "./entities/wallet-balance.entity";
import { CurrencyCode, DATABASE_LOCK_MODES } from "src/common/constants";

@Injectable()
export class WalletBalanceRepository extends BaseRepository<WalletBalance> {
    constructor(@Inject(DATA_SOURCE) dataSource: DataSource) {
        super(dataSource.getRepository(WalletBalance));
    }

    async createWalletBalances(
        walletId: string,
        currencies: CurrencyCode[] = [CurrencyCode.NGN, CurrencyCode.USD, CurrencyCode.EUR],
        manager?: EntityManager
    ): Promise<WalletBalance[]> {
        const repo = manager?.getRepository(WalletBalance) ?? this.repo;

        const balances = currencies.map(currency =>
            repo.create({
                wallet: { id: walletId },
                currency,
            })
        );
        await repo.insert(balances);
        return balances;
    }

    async getBalance(
        walletId: ID,
        currency: CurrencyCode,
        manager?: EntityManager,
        lockMode?: DatabaseLockMode,
    ): Promise<WalletBalance> {
        const balance = await this.findOneWithLock(
            'walletBalance',
            { wallet: { id: walletId }, currency },
            ['id', 'currency', 'balanceMinor'],
            manager,
            lockMode
        );

        if (!balance) {
            throw new NotFoundException(`Balance not found for wallet ${walletId} and currency ${currency}`);
        }

        return balance;
    }


    async credit(
        walletId: ID,
        currency: CurrencyCode,
        amountMinor: bigint,
        manager?: EntityManager,
    ): Promise<WalletBalance['balanceMinor']> {
        const repo = manager?.getRepository(WalletBalance) ?? this.repo;

        const result = await repo
            .createQueryBuilder()
            .update(WalletBalance)
            .set({ balanceMinor: () => `"balanceMinor" + ${amountMinor}` })
            .where({ wallet: { id: walletId }, currency })
            .returning('balanceMinor')
            .execute();

        return result.raw[0].balanceMinor;
    }

    async debit(
        walletId: ID,
        currency: CurrencyCode,
        amountMinor: bigint,
        manager?: EntityManager,
    ): Promise<WalletBalance['balanceMinor']> {
        const repo = manager?.getRepository(WalletBalance) ?? this.repo;

        const result = await repo
            .createQueryBuilder()
            .update(WalletBalance)
            .set({ balanceMinor: () => `"balanceMinor" - ${amountMinor}` })
            .where({ wallet: { id: walletId }, currency })
            .returning('balanceMinor')
            .execute();

        return result.raw[0].balanceMinor;
    }
}

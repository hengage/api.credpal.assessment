import { Inject, Injectable } from "@nestjs/common";
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
    ): Promise<WalletBalance | null> {
        return this.findOneWithLock(
            'walletBalance',
            { wallet: { id: walletId }, currency },
            ['id', 'currency', 'balanceMinor'],
            manager,
            lockMode
        );
    }

    async credit(
        walletId: ID,
        currency: CurrencyCode,
        amountMinor: bigint,
        manager?: EntityManager,
    ) {
        const repo = manager?.getRepository(WalletBalance) ?? this.repo;
        return repo.increment({ wallet: { id: walletId }, currency }, 'balanceMinor', amountMinor.toString());
    }

    async debit(
        walletId: ID,
        currency: CurrencyCode,
        amountMinor: bigint,
        manager?: EntityManager,
    ) {
        const repo = manager?.getRepository(WalletBalance) ?? this.repo;
        return repo.decrement({ wallet: { id: walletId }, currency }, 'balanceMinor', amountMinor.toString());
    }
}

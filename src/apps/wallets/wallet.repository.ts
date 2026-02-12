import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "src/common/database/base.repository";
import { DATA_SOURCE } from "src/common/constants";
import { DataSource, EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletBalance } from "./entities/wallet-balance.entity";
import { CurrencyCode } from "src/common/constants";

@Injectable()
export class WalletRepository extends BaseRepository<Wallet> {
    constructor(@Inject(DATA_SOURCE) dataSource: DataSource) {
        super(dataSource.getRepository(Wallet));
    }

    async createWallet(
        userId: string,
        manager?: EntityManager
    ): Promise<Wallet> {
        const repo = manager?.getRepository(Wallet) ?? this.repo;
        const wallet = repo.create({
            user: { id: userId },
        });
        return await repo.save(wallet);
    }

    async createWalletBalances(
        walletId: string,
        currencies: CurrencyCode[] = [CurrencyCode.NGN, CurrencyCode.USD, CurrencyCode.EUR],
        manager?: EntityManager
    ): Promise<WalletBalance[]> {
        const repo = manager?.getRepository(Wallet) ?? this.repo;

        const balances = currencies.map(currency =>
            repo.manager.getRepository(WalletBalance).create({
                wallet: { id: walletId },
                currency,
            })
        );
        await repo.manager.getRepository(WalletBalance).insert(balances);
        return balances;
    }

    async findOneBy(
        cond: FindOptionsWhere<Wallet> | FindOptionsWhere<Wallet>[],
        select?: (keyof Wallet)[],
        manager?: EntityManager,
        lockMode?: DatabaseLockMode,
    ): Promise<Wallet | null> {
        return this.findOneWithLock('wallet', cond, select, manager, lockMode);
    }
}

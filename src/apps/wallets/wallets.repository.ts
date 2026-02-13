import { Inject, Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/database/base.repository";
import { DATA_SOURCE } from "src/common/constants";
import { DataSource, EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { Wallet } from "./entities/wallet.entity";

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

    async findOneBy(
        cond: FindOptionsWhere<Wallet> | FindOptionsWhere<Wallet>[],
        select?: (keyof Wallet)[],
        manager?: EntityManager,
    ): Promise<Wallet | null> {
        const repo = manager?.getRepository(Wallet) ?? this.repo;
        return repo.findOne({
            where: cond,
            select,
        });
    }
}

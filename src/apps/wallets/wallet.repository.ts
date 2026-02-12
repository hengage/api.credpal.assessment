import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/database/base.repository";
import { Wallet } from "./entities/wallet.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class WalletRepository extends BaseRepository<Wallet> {
    constructor(
        @InjectRepository(Wallet)
        repo: Repository<Wallet>,
    ) {
        super(repo);
    }

    async findWalletByUserId(
        userId: ID,
        select?: (keyof Wallet)[],
        manager?: EntityManager,
        lockMode?: DatabaseLockMode,
    ) {
        return this.findOneWithLock('wallet', { user: { id: userId } } as Object, select, manager, lockMode);
    }
}

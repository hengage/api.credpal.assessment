import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base.repository';
import { DATA_SOURCE } from 'src/common/constants';
import { DataSource, EntityManager } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsRepository extends BaseRepository<Transaction> {
    constructor(@Inject(DATA_SOURCE) dataSource: DataSource) {
        super(dataSource.getRepository(Transaction));
    }

    async create(
        data: Partial<Transaction>,
        manager?: EntityManager,
    ): Promise<Transaction> {
        const repo = manager?.getRepository(Transaction) ?? this.repo;
        const transaction = repo.create(data);
        return await repo.save(transaction);
    }
}
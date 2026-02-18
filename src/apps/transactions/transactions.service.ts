import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './entities/transaction.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepo: TransactionsRepository) {}

  async create(
    data: Partial<Transaction>,
    manager?: EntityManager,
  ): Promise<Transaction> {
    return this.transactionsRepo.create(data, manager);
  }
}

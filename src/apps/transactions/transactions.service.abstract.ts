import { Transaction } from './entities/transaction.entity';
import { EntityManager } from 'typeorm';

export abstract class ITransactionsService {
  abstract create(
    data: Partial<Transaction>,
    manager?: EntityManager,
  ): Promise<Transaction>;
}

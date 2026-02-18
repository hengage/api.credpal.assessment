import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { DatabaseModule } from 'src/database/database.module';
import { ITransactionsService } from './transactions.service.abstract';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsRepository,
    {
      provide: ITransactionsService,
      useClass: TransactionsService,
    },
  ],
  exports: [ITransactionsService],
})
export class TransactionsModule {}

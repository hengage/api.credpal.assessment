import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletRepository } from './wallets.repository';
import { DatabaseModule } from 'src/database/database.module';
import { WalletsService } from './wallets.service';
import { WalletBalanceRepository } from './wallet-balance.repository';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [DatabaseModule, TransactionsModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository, WalletBalanceRepository],
  exports: [WalletsService],
})
export class WalletsModule {}

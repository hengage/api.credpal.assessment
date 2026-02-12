import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletRepository } from './wallets.repository';
import { DatabaseModule } from 'src/database/database.module';
import { WalletsService } from './wallets.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService],
})
export class WalletsModule {}

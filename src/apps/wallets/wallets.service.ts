import { Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallets.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class WalletsService {
  constructor(private readonly walletRepo: WalletRepository) { }

  async create(
    userId: ID,
    manager?: EntityManager
  ) {
    const wallet = await this.walletRepo.createWallet(userId, manager);
    const balances = await this.walletRepo.createWalletBalances(wallet.id, undefined, manager);
  }

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    return await this.walletRepo.findOneBy({ user: { id: userId } });
  }
}

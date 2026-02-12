import { Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { WalletBalance } from './entities/wallet-balance.entity';
import { WalletRepository } from './wallet.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepository) { }

  async createWallet(
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

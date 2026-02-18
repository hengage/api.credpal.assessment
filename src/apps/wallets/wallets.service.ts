import { Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallets.repository';
import { EntityManager } from 'typeorm';
import { FundWalletDto } from './dto/wallets.dto';
import { CurrencyUtil } from 'src/common/utils/currency.utils';
import { AtomicTransactionService } from 'src/database/atomic-transaction.service';
import { Msgs } from 'src/common/utils/messages.utils';
import { WalletBalanceRepository } from './wallet-balance.repository';
import { TransactionStatus, TransactionType } from '../transactions/entities/transaction.entity';
import { ITransactionsService } from '../transactions/transactions.service.abstract';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly walletBalanceRepo: WalletBalanceRepository,
    private readonly atomicTransaction: AtomicTransactionService,
    private readonly transactionsService: ITransactionsService,
  ) { }

  async create(
    userId: ID,
    manager?: EntityManager
  ) {
    const wallet = await this.walletRepo.createWallet(userId, manager);
    const balances = await this.walletBalanceRepo.createWalletBalances(wallet.id, undefined, manager);
  }

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    return await this.walletRepo.findOneBy({ user: { id: userId } });
  }

  async fundWallet(userId: ID, dto: FundWalletDto) {
    return this.atomicTransaction.runInAtomic(async (manager) => {
      const wallet = await this.walletRepo.findOneBy(
        { user: { id: userId } },
        ['id'],
        manager,
      );

      if (!wallet) {
        throw new NotFoundException(Msgs.common.NOT_FOUND('wallet'))
      }

      const amountMinor = CurrencyUtil.toMinor(dto.amount, dto.currency);

      await this.walletBalanceRepo.credit(wallet.id, dto.currency, amountMinor, manager);

      const updated = await this.walletBalanceRepo.getBalance(wallet.id, dto.currency, manager);

      // Record transaction
      await this.transactionsService.create(
        {
          wallet: { id: wallet.id } as any,
          type: TransactionType.FUND,
          status: TransactionStatus.SUCCESS,
          currency: dto.currency,
          amountMinor: String(amountMinor),
          balanceAfterMinor: updated.balanceMinor,
          description: `Funded ${dto.currency} wallet`,
        },
        manager,
      );


      return {
        currency: updated!.currency,
        balanceMajor: CurrencyUtil.toMajor(updated!.balanceMinor, dto.currency),
      };
    });
  }

  async getWallet(userId: string) {
    const wallet = await this.walletRepo.findOneWithBalances(userId);
    if (!wallet) throw new NotFoundException(Msgs.common.NOT_FOUND('wallet'));

    return {
      walletId: wallet.id,
      balances: wallet.balances.map((b) => ({
        currency: b.currency,
        balanceMajor: CurrencyUtil.toMajor(b.balanceMinor, b.currency),
      })),
    };
  }
}


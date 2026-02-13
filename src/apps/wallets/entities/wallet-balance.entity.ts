import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Wallet } from './wallet.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { CurrencyCode, TABLE_NAMES } from 'src/common/constants';

@Entity({ name: TABLE_NAMES.WALLET_BALANCE })
@Unique(['wallet', 'currency'])
export class WalletBalance extends BaseEntity {
    @ManyToOne(() => Wallet, (wallet) => wallet.balances, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'walletId' })
    wallet: Wallet;

    @Column({ length: 3 })
    currency: CurrencyCode;

    @Column({
        type: 'bigint',
        default: 0,
    })
    balanceMinor: string;
}

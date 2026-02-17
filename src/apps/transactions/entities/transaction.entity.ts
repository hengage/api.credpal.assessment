import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Wallet } from 'src/apps/wallets/entities/wallet.entity';
import { CurrencyCode, TABLE_NAMES } from 'src/common/constants';

export enum TransactionType {
    FUND = 'fund',
    CONVERT = 'convert',
    TRADE = 'trade',
}

export enum TransactionStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    PENDING = 'pending',
}

@Entity({ name: TABLE_NAMES.TRANSACTION })
@Index(['wallet', 'createdAt'])
export class Transaction extends BaseEntity {
    @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'walletId' })
    wallet: Wallet;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.SUCCESS,
    })
    status: TransactionStatus;

    @Column({ length: 3, comment: 'Source currency code' })
    currency: CurrencyCode;

    @Column({ type: 'bigint', comment: 'Amount in source currency minor units' })
    amountMinor: string;

    @Column({ type: 'bigint', comment: 'Wallet balance after transaction in minor units' })
    balanceAfterMinor: string;

    // For CONVERT/TRADE transactions
    @Column({ length: 3, nullable: true, comment: 'Target currency for CONVERT/TRADE' })
    toCurrency?: CurrencyCode;

    @Column({ type: 'bigint', nullable: true, comment: 'Amount in target currency minor units' })
    toAmountMinor?: string;

    @Column({
        type: 'decimal',
        precision: 18,
        scale: 8,
        nullable: true,
        comment: 'FX rate used (if applicable)',
    })
    rate?: number;

    @Column({ type: 'text', nullable: true, comment: 'Transaction description' })
    description?: string;
}

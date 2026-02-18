import { CURRENCY_META, CurrencyCode } from '../constants';

export class CurrencyUtil {
  static toMinor(amount: number, currency: CurrencyCode): bigint {
    const { minorUnit } = CURRENCY_META[currency];
    return BigInt(Math.round(amount * Math.pow(10, minorUnit)));
  }

  static toMajor(amountMinor: bigint | string, currency: CurrencyCode): number {
    const { minorUnit } = CURRENCY_META[currency];
    return Number(amountMinor) / Math.pow(10, minorUnit);
  }
}


export const DATA_SOURCE = 'DATA_SOURCE';



export const REPOSITORY_TOKENS = {
  USER: 'USER_REPOSITORY',
  WALLET: 'WALLET_REPOSITORY',
  WALLET_BALANCE: 'WALLET_BALANCE_REPOSITORY',
} as const;



export const TABLE_NAMES = {
  USERS: 'users',
  WALLET: 'wallets',
  WALLET_BALANCE: 'wallet_balances',

} as const;



export const DATABASE_LOCK_MODES = {

  PESSIMISTIC_READ: 'pessimistic_read',

  PESSIMISTIC_WRITE: 'pessimistic_write',

} as const;



export const SORT_ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;



export const AUTH_STRATEGIES = {

  LOCAL: 'local',

  JWT: 'jwt',

} as const;



export const METADATA_KEYS = {

  RESPONSE_MESSAGE: 'responseMessage',

} as const;

export enum CurrencyCode {
  USD = 'USD',
  NGN = 'NGN',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  KWD = 'KWD',
}


export const CURRENCY_META = {
  [CurrencyCode.USD]: { code: CurrencyCode.USD, minorUnit: 2, symbol: '$' },
  [CurrencyCode.NGN]: { code: CurrencyCode.NGN, minorUnit: 2, symbol: '₦' },
  [CurrencyCode.EUR]: { code: CurrencyCode.EUR, minorUnit: 2, symbol: '€' },
  [CurrencyCode.GBP]: { code: CurrencyCode.GBP, minorUnit: 2, symbol: '£' },
  [CurrencyCode.JPY]: { code: CurrencyCode.JPY, minorUnit: 0, symbol: '¥' },
  [CurrencyCode.CAD]: { code: CurrencyCode.CAD, minorUnit: 2, symbol: '$' },
  [CurrencyCode.AUD]: { code: CurrencyCode.AUD, minorUnit: 2, symbol: '$' },
  [CurrencyCode.CHF]: { code: CurrencyCode.CHF, minorUnit: 2, symbol: 'CHF' },
  [CurrencyCode.KWD]: { code: CurrencyCode.KWD, minorUnit: 3, symbol: 'د.ك' },
};

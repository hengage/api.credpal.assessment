export const DATA_SOURCE = 'DATA_SOURCE';

export const REPOSITORY_TOKENS = {
  USER: 'USER_REPOSITORY',
} as const;

export const TABLE_NAMES = {
  USERS: 'users',
} as const;

export const DATABASE_LOCK_MODES = {
  PESSIMISTIC_READ: 'pessimistic_read',
  PESSIMISTIC_WRITE: 'pessimistic_write',
} as const;

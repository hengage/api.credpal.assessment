type Keys<T> = keyof T;

import { DATABASE_LOCK_MODES } from './common/constants';

declare type DatabaseLockMode =
  (typeof DATABASE_LOCK_MODES)[keyof typeof DATABASE_LOCK_MODES];

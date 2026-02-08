import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '../constants';

export const ResponseMessage = (message: string) =>
  SetMetadata(METADATA_KEYS.RESPONSE_MESSAGE, message);

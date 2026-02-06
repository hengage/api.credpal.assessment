import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailParams } from './email.interface';

@Injectable()
export abstract class BaseEmailService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor() { }

  abstract sendEmail(params: EmailParams): Promise<void>;

  protected handleEmailError(error: any): never {
    this.logger.error('Failed to send email', error);
    throw new InternalServerErrorException('Failed to send email');
  }
}

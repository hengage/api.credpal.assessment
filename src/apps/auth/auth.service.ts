import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { AtomicTransactionService } from 'src/database/atomic-transaction.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly atomicTransaction: AtomicTransactionService,
  ) {}

  async register(data: RegisterDto): Promise<User> {
    return this.atomicTransaction.runInAtomic(
      async (txnManager: EntityManager) => {
        const user = await this.usersService.create(data, txnManager);

        return user;
      },
    );
  }
}

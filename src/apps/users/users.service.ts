import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { EntityManager } from 'typeorm';
import { Msgs } from 'src/common/utils/messages.utils';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: Partial<User>, manager?: EntityManager) {
    const existingUser = await this.usersRepository.findOneOrNull(
      { email: userData.email },
      ['email'],
      manager,
    );
    if (existingUser) {
      throw new ConflictException(Msgs.auth.USER_ALREADY_EXISTS());
    }
    return this.usersRepository.create(userData, manager);
  }

  async findByEmail(email: string, manager?: EntityManager): Promise<User> {
    return this.usersRepository.findByEmail(email, manager);
  }

  async markAsVerified(email: string, manager?: EntityManager): Promise<void> {
    const user = await this.usersRepository.findByEmail(email, manager);
    await this.usersRepository.updateUser(user.id, { verifiedAt: new Date() }, manager);
  }
}

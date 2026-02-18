import { ConflictException, Injectable } from '@nestjs/common';
import { Msgs } from 'src/common/utils/messages.utils';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

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

  async findById(
    id: string,
    select?: Array<keyof User>,
    manager?: EntityManager,
  ): Promise<User> {
    return this.usersRepository.findOneBy({ id }, select, manager);
  }

  async findOneOrNull(
    cond: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    select?: Array<keyof User>,
    manager?: EntityManager,
  ): Promise<User | null> {
    return this.usersRepository.findOneOrNull(cond, select, manager);
  }

  async markAsVerified(email: string, manager?: EntityManager): Promise<void> {
    const user = await this.usersRepository.findByEmail(email, manager);
    await this.usersRepository.updateUser(
      user.id,
      { verifiedAt: new Date() },
      manager,
    );
  }
}

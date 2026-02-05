import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { EntityManager } from 'typeorm';

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
      throw new Error('User already exists');
    }
    return this.usersRepository.create(userData, manager);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: User) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

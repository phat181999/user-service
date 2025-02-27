import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createUser(userName: string, email: string, password: string): Promise<any> {
    const user = this.userRepo.create({ userName, email, password });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<any> {
    return this.userRepo.find();
  }

  async findById(userId: number): Promise<any> {
    return this.userRepo.findOne({ where: { userId } });
  }
}

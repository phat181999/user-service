import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDTO } from '../dto/createUser.dto';
import { GetUser } from '../dto/getUser.dto';

@Injectable()
export class UserRepository {
  private logger: Logger;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.logger = new Logger(UserRepository.name);
  }

  async createUser(userName: string, email: string, password: string): Promise<CreateUserDTO> {
    try{
      const user = await this.userRepo.create({ userName, email, password });
      return this.userRepo.save(user);
    }catch(error){
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findAll(): Promise<GetUser[]> {
    try{
      const users = await this.userRepo.find();
      return users;
    }catch(error){
      this.logger.error(`Error getting all users: ${error.message}`);
      return error;
    }
  }

  async findById(userId: string): Promise<any> {
    return await this.userRepo.findOne({ where: { userId } });
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userRepo.findOne({ where: { email } });
  }
}

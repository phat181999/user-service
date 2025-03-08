import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import {HashPassword} from '../../../utils/hashPassword';
import { CreateUserDTO } from '../dto/createUser.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly HashPassword: HashPassword,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async createUser(createUserDto: CreateUserDTO): Promise<CreateUserDTO> {
    try{
      const { userName, email, password } = createUserDto;
      if(!userName || !email || !password){
        this.logger.error('Username, Email and Password are required');
        throw new Error('Username, Email and Password are required')
      }
      const hashedPassword = await this.HashPassword.hashPassword(password);
      return await this.userRepository.createUser(userName, email, hashedPassword);
    }catch(error){
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUsers(): Promise<UserEntity[]> {
    try{
      const users = await this.userRepository.findAll();
      return users;
    }catch(error){
      this.logger.error(`Error getting all users: ${error.message}`);
      return error;
    }
  }

  async getUserById(userId: string) {
    return this.userRepository.findById(userId);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}

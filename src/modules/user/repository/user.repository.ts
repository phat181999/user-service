import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDTO } from '../dto/createUser.dto';
import { GetUser } from '../dto/getUser.dto';
import { UserRole } from 'src/shared/interface/user.interface';
import { LoginUserDto } from '../../auth/dto/loginUser.dto';

@Injectable()
export class UserRepository {
  private logger: Logger;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.logger = new Logger(UserRepository.name);
  }

  async createUser(userCreate: CreateUserDTO): Promise<CreateUserDTO> {
    try{
      const { userName, email, password, role } = userCreate;
      const user = await this.userRepo.create({ userName, email, password, role: role ?? UserRole.USER });
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
      throw error;
    }
  }

  async findById(userId: string): Promise<GetUser | null> {
    try{
      const user = await this.userRepo.findOne({ where: { userId } });
      return user;
    }catch(error){
      this.logger.error(`Error getting user by id: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<GetUser | null> {
    try{
      const user = await this.userRepo.findOne({ where: { email } });
      return user;
    }catch(error){
      this.logger.error(`Error getting user by email: ${error.message}`);
      throw error;
    }
  }

  async updateUserById(userId: string, userCreate: Partial<CreateUserDTO>): Promise<CreateUserDTO | null> {
    try{
      const { userName, email, password } = userCreate;
      const user = await this.userRepo.findOne({ where: { userId } });
      if(!user){
        this.logger.error('User not found');
        return null;
      }
      user.userName = userName ?? user.userName;
      user.email = email ?? user.email;
      user.password = password ?? user.password;
      return this.userRepo.save(user);
    }catch(error){
      this.logger.error(`Error updating user by id: ${error.message}`);
      throw new Error(`Error updating user by id: ${error.message}`);
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    try{
      await this.userRepo.delete(userId);
      return true;
    }catch(error){
      this.logger.error(`Error deleting user by id: ${error.message}`);
      throw new Error(`Error deleting user by id: ${error.message}`);
    }
  }
}

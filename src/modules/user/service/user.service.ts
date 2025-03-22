import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import {HashPassword} from '../../../utils/hashPassword';
import { CreateUserDTO } from '../dto/createUser.dto';
import { GetUser } from '../dto/getUser.dto';
import { GetUserLogin, LoginUserDto } from '../../auth/dto/loginUser.dto';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy{
  private logger: Logger;
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private consumer: Consumer;
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly HashPassword: HashPassword,
  ) {
    this.logger = new Logger(UserService.name);
    this.consumer = this.kafka.consumer({ groupId: 'user-service-group' });
  }
  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'check-user-exists', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const { userId } = JSON.parse(message.value?.toString() || '{}');
        console.log(`🔍 Checking user existence: ${userId}`);

        // Giả sử kiểm tra user có tồn tại không (Dùng DB thực tế ở đây)
        const userExists = await this.getUserById(userId);

        if (userExists) {
          console.log(`✅ User ${userId} exists!`);
        } else {
          console.log(`❌ User ${userId} does not exist!`);
        }
      },
    });
  }

  async createUser(createUserDto: CreateUserDTO): Promise<CreateUserDTO> {
    try{
      const { userName, email, password } = createUserDto;
      if(!userName || !email || !password){
        this.logger.error('Username, Email and Password are required');
        throw new Error('Username, Email and Password are required')
      }
      const hashedPassword = await this.HashPassword.hashPassword(password);
      const userCreate = {...createUserDto, password: hashedPassword};
      return await this.userRepository.createUser(userCreate);
    }catch(error){
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUsers(): Promise<GetUser[]> {
    try{
      const users = await this.userRepository.findAll();
      return users;
    }catch(error){
      this.logger.error(`Error getting all users: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserById(userId: string): Promise<GetUser | null> {
    try{
      if(!userId) {
        this.logger.error('userId is required');
        throw new Error('userId is required');
      }
      const user = await this.userRepository.findById(userId);
      if(!user){
        this.logger.error('User not found');
        return null;
      }
      return user;
    }catch(error){
      this.logger.error(`Error getting user by id: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<GetUser | null> {
    try{
      if(!email) {
        this.logger.error('Email is required');
        throw new Error('Email is required');
      }
      const user = await this.userRepository.findByEmail(email);
      return user;
    }catch(error){
      this.logger.error(`Error getting user by email: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateUser(userId: string, userCreate: Partial<CreateUserDTO>): Promise<CreateUserDTO> {
    try{
      const userUpdate = await this.userRepository.updateUserById(userId, userCreate);
      if(!userUpdate){
        this.logger.error('User not found');
        throw new Error('User not found');
      }
      return userUpdate;
    }catch(error){
      this.logger.error(`Error updating user: ${error.message}`);
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try{
      const user = await this.userRepository.findById(userId);
      if(!user){
        this.logger.error('User not found');
        throw new Error('User not found');
      }
      await this.userRepository.deleteUserById(userId);
      return true;
    }catch(error){
      this.logger.error(`Error deleting user: ${error.message}`);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
    
}

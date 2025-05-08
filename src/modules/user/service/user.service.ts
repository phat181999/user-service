import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { HashPassword } from '../../../utils/hashPassword';
import { CreateUserDTO, createUserWithGoogleDto } from '../dto/createUser.dto';
import {
  CreateUserGoogle,
  GetUser,
  UpdateUser,
  UserRole,
} from '../../../shared/interface/index';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword,
  ) {}

  async createUser(
    createUserDto: CreateUserDTO,
  ): Promise<CreateUserDTO | null> {
    try {
      const { userName, email, password } = createUserDto;
      const hashedPassword = await this.hashPassword.hashPassword(password);
      const userToCreate = { ...createUserDto, password: hashedPassword };
      const createdUser = await this.userRepository.createUser(userToCreate);

      return { ...createdUser, role: UserRole.USER };
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw new Error('Error creating user');
    }
  }

  async createUserWithGoogle(
    createUserDto: createUserWithGoogleDto,
  ): Promise<CreateUserGoogle | null> {
    try {
      return await this.userRepository.createUserWithGoogle(createUserDto);
    } catch (error) {
      this.logger.error('Error creating user with Google', error);
      throw new Error('Error creating user with Google');
    }
  }

  async getUsers(): Promise<GetUser[] | null> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.error('Error getting all users', error);
      throw new Error('Error getting all users');
    }
  }

  async getUserById(userId: string): Promise<GetUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.error('User not found');
        return null;
      }
      return user;
    } catch (error) {
      this.logger.error('Error getting user by ID', error);
      throw new Error('Error getting user by ID');
    }
  }

  async getUserByEmail(email: string): Promise<GetUser | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      this.logger.error('Error getting user by email', error);
      throw new Error('Error getting user by email');
    }
  }

  async updateUser(
    userId: string,
    updateData: Partial<UpdateUserDto>,
  ): Promise<UpdateUser | null> {
    try {
      const updatedUser = await this.userRepository.updateUserById(
        userId,
        updateData,
      );
      if (!updatedUser) {
        this.logger.error('User not found');
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      this.logger.error('Error updating user', error);
      throw new Error('Error updating user');
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.error('User not found');
        throw new Error('User not found');
      }
      await this.userRepository.deleteUserById(userId);
      return true;
    } catch (error) {
      this.logger.error('Error deleting user', error);
      throw new Error('Error deleting user');
    }
  }
}

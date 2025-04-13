import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { HashPassword } from '../../../utils/hashPassword';
import { CreateUserDTO, createUserWithGoogleDto } from '../dto/createUser.dto';
import { CreateUserGoogle, GetUser, UpdateUser, UserRole } from 'src/shared/interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import {  Utils } from 'src/utils/error-helper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword,
    private readonly utils: Utils,
  ) {}


  async createUser(createUserDto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      const { userName, email, password } = createUserDto;

      this.utils.throwIfMissing('Username', userName);
      this.utils.throwIfMissing('Email', email);
      this.utils.throwIfMissing('Password', password);

      const hashedPassword = await this.hashPassword.hashPassword(password);
      const userToCreate = { ...createUserDto, password: hashedPassword };
      const createdUser = await this.userRepository.createUser(userToCreate);

      return { ...createdUser, role: UserRole.USER };
    } catch (error) {
      this.utils.handleError('creating user', error);
    }
  }

  async createUserWithGoogle(createUserDto: createUserWithGoogleDto): Promise<CreateUserGoogle> {
    try {
      this.utils.throwIfMissing('Email', createUserDto.email);
      return await this.userRepository.createUserWithGoogle(createUserDto);
    } catch (error) {
      this.utils.handleError('creating user with Google', error);
    }
  }

  async getUsers(): Promise<GetUser[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.utils.handleError('getting all users', error);
    }
  }

  async getUserById(userId: string): Promise<GetUser | null> {
    try {
      this.utils.throwIfMissing('User ID', userId);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.error('User not found');
        return null;
      }
      return user;
    } catch (error) {
      this.utils.handleError('getting user by ID', error);
    }
  }

  async getUserByEmail(email: string): Promise<GetUser | null> {
    try {
      this.utils.throwIfMissing('Email', email);
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      this.utils.handleError('getting user by email', error);
    }
  }

  async updateUser(userId: string, updateData: Partial<UpdateUserDto>): Promise<UpdateUser> {
    try {
      const updatedUser = await this.userRepository.updateUserById(userId, updateData);
      if (!updatedUser) {
        this.logger.error('User not found');
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      this.utils.handleError('updating user', error);
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
      this.utils.handleError('deleting user', error);
    }
  }
}

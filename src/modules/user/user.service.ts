import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { HashPassword } from '../../utils/hashPassword';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly HashPassword: HashPassword,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    const { userName, email, password } = createUserDto;
    const hashedPassword = await this.HashPassword.hashPassword(password);
    return await this.userRepository.createUser(userName, email, hashedPassword);
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(userId: string) {
    return this.userRepository.findById(userId);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}

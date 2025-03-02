import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDTO) {
    const { userName, email, password } = createUserDto;
    return this.userRepository.createUser(userName, email, password);
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

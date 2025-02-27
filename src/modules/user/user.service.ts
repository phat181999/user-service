import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(username: string, email: string, password: string) {
    return this.userRepository.createUser(username, email, password);
  }

  async getUsers() {
    return this.userRepository.findAll();
  }
}

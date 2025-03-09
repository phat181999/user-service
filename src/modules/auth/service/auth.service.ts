import { Body, Injectable, Logger, Post } from "@nestjs/common";
import { GetUserLogin, LoginUserDto } from "src/modules/auth/dto/loginUser.dto";
import { UserRepository } from "src/modules/user/repository/user.repository";
import {HashPassword} from '../../../utils/hashPassword';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
    private logger: Logger;
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly HashPassword: HashPassword,
    ) {
        this.logger = new Logger(AuthService.name);
        this.logger.log(`UserRepository: ${this.userRepository ? 'Injected' : 'Not Injected'}`);
    }
    
    async login(createUserDto: LoginUserDto): Promise<GetUserLogin> {
        try {
          const { email, password } = createUserDto;
          const user = await this.userRepository.findByEmail(email);
          if(!user){
            this.logger.error('User not found');
            throw new Error('User not found');
          }
          const isPasswordMatch = await this.HashPassword.comparePassword(password, user.password);
          if(!isPasswordMatch){
            this.logger.error('Password does not match');
            throw new Error('Password does not match');
          }
          return user;
        } catch (error) {
          this.logger.error(`Error logging in user: ${error.message}`);
          throw new Error(`Error logging in user: ${error.message}`);
        }
      }
    
    async register() {
        return 'register';
    }
    
    async forgotPassword() {
        return 'forgotPassword';
    }
    
    async resetPassword() {
        return 'resetPassword';
    }
    
    async changePassword() {
        return 'changePassword';
    }
    
    async verifyEmail() {
        return 'verifyEmail';
    }
    
    async resendEmailVerification() {
        return 'resendEmailVerification';
    }
    
    async logout() {
        return 'logout';
    }
}
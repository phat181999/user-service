import { BadRequestException, Body, Inject, Injectable, InternalServerErrorException, Logger, Post, UnauthorizedException } from "@nestjs/common";
import { GetUserLogin, LoginUserDto } from "src/modules/auth/dto/loginUser.dto";
import { UserRepository } from "src/modules/user/repository/user.repository";
import {HashPassword} from '../../../utils/hashPassword';
import type { Cache } from 'cache-manager'
import { JwtService } from "@nestjs/jwt";
import { LoginGoogleDto } from "../dto/login-google.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class AuthService {
    private logger: Logger;
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly HashPassword: HashPassword,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.logger = new Logger(AuthService.name);
    }
    
    async login(createUserDto: LoginUserDto): Promise<GetUserLogin> {
        try {
          const { email, password } = createUserDto;
          const user = await this.userRepository.findByEmail(email);
      
          if (!user) {
            this.logger.error('User not found');
            throw new UnauthorizedException();
          }
      
          const isPasswordMatch = await this.HashPassword.comparePassword(password, user.password);
          if (!isPasswordMatch) {
            this.logger.error('Password does not match');
            throw new UnauthorizedException('Unauthorized');
          }
      
          const payload = {
            sub: user.userId,
            username: user.userName,
            email: user.email,
            role: user.role,
          };
      
          const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '1d' });
      
          await this.cacheManager.set(
            `refresh_token_${user.userId}`,
            refreshToken,
            86400 // 1 day
          );

          return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
            refreshToken,
            refresh_expires_in: 86400,
            expires_in: 3600,
          };
        } catch (error) {
          this.logger.error(`Error logging in user: ${error.message}`);
          throw new Error(`Error logging in user: ${error.message}`);
        }
    }
      
    async refreshToken(userId: string, refreshToken: string): Promise<any> {
        try {
            const cachedToken = await this.cacheManager.get(`refresh_token_${userId}`);
            if (!cachedToken || cachedToken !== refreshToken) {
                this.logger.error('Refresh token not found or does not match');
                throw new UnauthorizedException('Unauthorized');
            }
            
            const user = await this.userRepository.findById(userId);
            if (!user) {
                this.logger.error('User not found');
                throw new UnauthorizedException('Unauthorized');
            }
            
            const payload = {
                sub: user.userId,
                username: user.userName,
                email: user.email,
                role: user.role,
            };
            
            const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
            
            return {
                access_token: newAccessToken,
                refresh_token: refreshToken,
                expires_in: 3600,
            };
        }
        catch (error) {
            this.logger.error(`Error refreshing token: ${error.message}`);
            throw new BadRequestException(`Error refreshing token: ${error.message}`);
        }
    }
    
    async loginWithGoogle(user: LoginGoogleDto):Promise<any> {
        try{
            const {email} = user;
            const userExists = await this.userRepository.findByEmail(email);
            if(!userExists){
                const newUser = await this.userRepository.createUserWithGoogle({
                    ...user,
                    userName: user.firstName,
                    image: user.picture
                });
                return {
                    ...newUser,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    picture: user.picture,
                    accessToken: '',
                    refreshToken: ''
                };
            }
            return {
                ...userExists,
                accessToken: '',
                refreshToken: ''
            };
        }catch(error){
            this.logger.error(`Error logging in user: ${error.message}`);
            throw new BadRequestException(`Error logging in user: ${error.message}`);
        }
    }

    async loginWithGithub(user: any):Promise<any> {
        try{
            const {email, username} = user;
            const userExists = await this.userRepository.findByEmail(email);

            if(!userExists){
                const newUser = await this.userRepository.createUserWithGithub({
                    ...user,
                    userName: user.firstName,
                    image: user.avatar
                });
                return {
                    newUser,

                    accessToken: '',
                    refreshToken: ''
                };
            }
            return {
                ...userExists,
                accessToken: '',
                refreshToken: ''
            };
        }catch(error){
            this.logger.error(`Error logging in user: ${error.message}`);
            throw new BadRequestException(`Error logging in user: ${error.message}`);
        }
    }

    async checkUserExists(email: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findByEmail(email);
            return !!user;
        }catch (error) {
            this.logger.error(`Error checking user exists: ${error.message}`);
            throw new BadRequestException(`Error checking user exists: ${error.message}`);
        }
    }

    async logout(userId: string): Promise<{ message: string }> {
        try {
          await this.cacheManager.del(`refresh_token_${userId}`);
          return { message: 'Logged out successfully' };
        } catch (err) {
          throw new InternalServerErrorException('Logout failed');
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
}
import { BadRequestException, Body, Injectable, Logger, Post, UnauthorizedException } from "@nestjs/common";
import { GetUserLogin, LoginUserDto } from "src/modules/auth/dto/loginUser.dto";
import { UserRepository } from "src/modules/user/repository/user.repository";
import {HashPassword} from '../../../utils/hashPassword';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginGoogleDto } from "../dto/login-google.dto";

@Injectable()
export class AuthService {
    private logger: Logger;
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly HashPassword: HashPassword,
        private jwtService: JwtService
    ) {
        this.logger = new Logger(AuthService.name);
    }
    
    async login(createUserDto: LoginUserDto): Promise<GetUserLogin> {
        try {
            const { email, password } = createUserDto;
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                this.logger.error('User not found');
                throw new UnauthorizedException();
            }
            const isPasswordMatch = await this.HashPassword.comparePassword(password, user.password);
            if(!isPasswordMatch){
                this.logger.error('Password does not match');
                throw new UnauthorizedException('Unauthorized');
            }
            const payload = { sub: user.userId, username: user.userName, email: user.email, role: user.role };
            return {
                access_token: await this.jwtService.signAsync(payload),
                refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '1d' }),
                refresh_expires_in: 86400,
                expires_in: 3600,
                
            };
        } catch (error) {
          this.logger.error(`Error logging in user: ${error.message}`);
          throw new Error(`Error logging in user: ${error.message}`);
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
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/modules/auth/dto/loginUser.dto';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { HashPassword } from '../../../utils/hashPassword';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { LoginGoogleDto } from '../dto/login-google.dto';
import { User } from 'src/shared/interface/user/user.interface';
import {
  GetUserLogin,
  UserStatus,
} from 'src/shared/interface/auth/auth.intergace';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  private logError(message: string, error?: any) {
    this.logger.error(message, error);
    throw new BadRequestException(message);
  }

  private async generateTokens(user: User): Promise<GetUserLogin | undefined> {
    const payload = {
      sub: user.userId,
      username: user.userName,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    await this.redisService.set(user.userId, UserStatus.ONLINE, 86400);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
      refresh_expires_in: 86400,
      userStatus: true,
    };
  }

  async login(createUserDto: LoginUserDto): Promise<GetUserLogin | undefined> {
    try {
      const { email, password } = createUserDto;
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        this.logError('User not found');
        throw new UnauthorizedException('User not found');
      }

      const isPasswordMatch = await this.hashPassword.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordMatch) {
        this.logError('Password does not match');
        throw new UnauthorizedException('Password does not match');
      }

      return this.generateTokens(user);
    } catch (error) {
      this.logError('Error logging in user', error);
      throw error;
    }
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<GetUserLogin | undefined> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logError('User not found');
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      this.logError('Error refreshing token', error);
      throw new BadRequestException('Error refreshing token');
    }
  }

  async loginWithGoogle(
    user: LoginGoogleDto,
  ): Promise<GetUserLogin | undefined> {
    try {
      const { email } = user;
      const existingUser = await this.userRepository.findByEmail(email);

      if (!existingUser) {
        const newUser = await this.userRepository.createUserWithGoogle({
          ...user,
          userName: user.firstName,
          image: user.picture,
        });
        return {
          ...newUser,
          access_token: '',
          refresh_token: '',
          expires_in: 3600,
          refresh_expires_in: 86400,
          userStatus: true,
        };
      }

      return {
        ...existingUser,
        access_token: '',
        refresh_token: '',
        expires_in: 3600,
        refresh_expires_in: 86400,
        userStatus: true,
      };
    } catch (error) {
      this.logError('Error logging in with Google', error);
      throw new BadRequestException('Error logging in with Google');
    }
  }

  async loginWithGithub(user: any): Promise<GetUserLogin | undefined> {
    try {
      const { email, username } = user;
      const existingUser = await this.userRepository.findByEmail(email);

      if (!existingUser) {
        const newUser = await this.userRepository.createUserWithGithub({
          ...user,
          userName: username,
          image: user.avatar,
        });
        return {
          ...newUser,
          access_token: '',
          refresh_token: '',
          expires_in: 3600,
          refresh_expires_in: 86400,
          userStatus: true,
        };
      }

      return {
        ...existingUser,
        access_token: '',
        refresh_token: '',
        expires_in: 3600,
        refresh_expires_in: 86400,
        userStatus: true,
      };
    } catch (error) {
      this.logError('Error logging in with GitHub', error);
      throw new BadRequestException('Error logging in with GitHub');
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return !!user;
    } catch (error) {
      this.logError('Error checking if user exists', error);
      return false;
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    try {
      await this.redisService.del(userId);
      return { message: 'Logged out successfully' };
    } catch (err) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  // Placeholder methods to implement as needed
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

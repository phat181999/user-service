import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { HashPassword } from 'src/utils/hashPassword';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { CloudinaryProvider } from 'src/config/cloudinary/cloudinary.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RedisModule),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashPassword,
    GoogleStrategy,
    GitHubStrategy,
    CloudinaryProvider,
  ],
  exports: [AuthService],
})
export class AuthModule {}

// auth.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { HashPassword } from "src/utils/hashPassword";
import { UsersModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategies/google.strategy";
import { GitHubStrategy } from "./strategies/github.strategy";
import { CloudinaryProvider } from "src/config/cloudinary/cloudinary.provider";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisStore = (await import('cache-manager-redis-store')).redisStore;
        return {
          store: redisStore,
          host: 'localhost',      // replace with your Redis host
          port: 6379,             // replace with your Redis port
          ttl: 0                  // default TTL if not passed
        };
      },
    }),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], // important to import ConfigModule
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // get secret from env
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
    CloudinaryProvider
  ],
  exports: [AuthService],
})
export class AuthModule {}

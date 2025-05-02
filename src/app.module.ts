import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/user/user.module';
import { typeOrmConfig } from './config/appConfig/dbConfig';
import { AuthModule } from './modules/auth/auth.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TcpModule } from './modules/tcp/tcp.module';
import { RedisModule } from './modules/redis/redis.module';
import { DatabaseModule } from './config/appConfig/database.module';
import { CloudinaryModule } from './config/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,  
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
    }),
    UsersModule,
    AuthModule,
    RedisModule,
    TcpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
  exports:[]
})
export class AppModule {}

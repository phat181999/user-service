import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/user/user.module';
import { typeOrmConfig } from './config/appConfig/dbConfig';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,  
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
    }),
    UsersModule,
    AuthModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService, ],
  exports:[]
})
export class AppModule {}

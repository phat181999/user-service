import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisClientFactory } from './redis.config';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS',
      useFactory: redisClientFactory,
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS', RedisService],
})
export class RedisModule {}

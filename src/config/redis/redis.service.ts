import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async onModuleInit() {
    try {
      await this.redis.ping();
      this.logger.log('✅ Redis ping successful, connection verified.');
    } catch (error) {
      this.logger.error('❌ Redis connection failed on startup:', error.message);
      process.exit(1); 
    }
  }

  getClient(): Redis {
    return this.redis;
  }
}

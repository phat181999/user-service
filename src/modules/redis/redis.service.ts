import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { UserStatus } from 'src/shared/interface/auth/auth.intergace';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

  async onModuleInit() {
    try {
      await this.redisClient.ping();
      this.logger.log('✅ Redis ping successful, connection verified.');
    } catch (error) {
      this.logger.error('❌ Redis connection failed on startup:', error.message);
      process.exit(1); 
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: UserStatus, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
      return;
    }
    await this.redisClient.set(key, value);
    return
  }

  async del(key: string): Promise<number | undefined> {
    return this.redisClient.del(key);
  }

  async exists(key: string): Promise<number | undefined> {
    return this.redisClient.exists(key);
  }
}

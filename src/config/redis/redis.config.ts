// src/redis/redis.config.ts
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisClientFactory = (configService: ConfigService): Redis => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (!redisUrl) {
    throw new Error('[Redis] REDIS_URL environment variable is not defined');
  }

  const redis = new Redis(redisUrl);

  redis.on('connect', () => {
    console.log('[Redis] Connecting...');
  });

  redis.on('ready', () => {
    console.log('[Redis] Connected and ready ✅');
  });

  redis.on('error', (err) => {
    console.error('[Redis] Connection error ❌:', err.message);
  });

  redis.on('end', () => {
    console.warn('[Redis] Connection closed ⚠️');
  });

  return redis;
};

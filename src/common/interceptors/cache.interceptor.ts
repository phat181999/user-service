import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, lastValueFrom } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const NodeCache = require('node-cache');

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache: typeof NodeCache;
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly reflector: Reflector) {
    this.cache = new NodeCache({ stdTTL: 600 }); // TTL 10 phút
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = request.originalUrl;

    // Nếu có ?refresh=true, bỏ qua cache
    if (request.query.refresh === 'true') {
      this.logger.log(`Cache bypassed for ${cacheKey}`);
      return lastValueFrom(
        next.handle().pipe(
          tap((data) => {
            if (Array.isArray(data)) {
              this.logger.log(
                `Storing array of ${data.length} objects in cache for ${cacheKey}`,
              );
            }
            this.cache.set(cacheKey, data);
          }),
        ),
      );
    }

    // Kiểm tra cache
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      this.logger.log(
        `Cache hit for ${cacheKey}, returning ${Array.isArray(cachedData) ? cachedData.length : 1} objects`,
      );
      return Promise.resolve({
        data: cachedData,
        fromCache: true,
      });
    }

    // Nếu không có cache, gọi API rồi cache lại
    this.logger.log(`Cache miss for ${cacheKey}`);
    return lastValueFrom(
      next.handle().pipe(
        tap((data) => {
          if (Array.isArray(data)) {
            this.logger.log(
              `Storing array of ${data.length} objects in cache for ${cacheKey}`,
            );
          }
          this.cache.set(cacheKey, data);
        }),
      ),
    );
  }
}

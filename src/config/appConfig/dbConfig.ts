import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DIRECT_URL'),
  entities: [join(__dirname, '../../modules/**/*.entity.{ts,js}')],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

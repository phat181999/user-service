import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [join(__dirname, '../../modules/**/*.entity.{ts,js}')],
    synchronize: true, 
});

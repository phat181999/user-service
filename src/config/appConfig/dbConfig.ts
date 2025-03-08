import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'phatho',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME  || 'userdb',
    entities: [join(__dirname, '../../modules/**/*.entity.{ts,js}')],
    synchronize: true, 
};
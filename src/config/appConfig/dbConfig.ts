import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'phatho',
    password: process.env.DB_PASSWORD || 'postgresql',
    database: process.env.DB_NAME  || 'userdb',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // set to false in production
};
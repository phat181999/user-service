import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { logLevel } from '@nestjs/microservices/external/kafka.interface';
import { UsersModule } from '../user/user.module';
import { KafkaController } from './controller/kafka.controller';
import { KafkaProducerService } from './service/kafka.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        CacheModule.register(),
        ConfigModule.forRoot(),
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'user-app-client',
                            brokers: [configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
                            logLevel: logLevel.DEBUG,
                        },
                        // retry: {
                        //     retries: 10, // Tăng số lần retry trước khi từ bỏ
                        //     factor: 2,    // Exponential backoff
                        //     minTimeout: 1000, // Ít nhất 1s giữa các lần thử
                        // },
                        consumer: {
                            groupId: 'user-app-service-group',
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [KafkaController],
    providers:[KafkaProducerService],
    exports: [],
})
export class KafkaModule {}


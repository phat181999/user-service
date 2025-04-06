import { CacheModule } from "@nestjs/cache-manager";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TcpService } from "./service/tcp.service";
import { UsersModule } from "../user/user.module";
import { TcpController } from "./controller/tcp.controller";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        ConfigModule,
        CacheModule.register(),
        ClientsModule.registerAsync([
          {
            name: 'CHAT_SERVICE',
            useFactory: (configService: ConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: configService.get<string>('TCP_HOST') || 'localhost',
                port: configService.get<number>('TCP_PORT') || 6000,
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      controllers: [TcpController],
      providers: [TcpService],
      exports: [TcpService],
})

export class TcpModule {}
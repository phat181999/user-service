import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['log', 'error', 'warn'],
      timestamp: true,
      colors: true,
      prefix: 'NestJS',
    }),
  });
  const config = new DocumentBuilder()
  .setTitle('User Service')
  .setDescription('The User Service API description')
  .setVersion('1.0')
  .addTag('user')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
      },
      consumer: {
        groupId: 'user-app-service-group',
      },
    },
  });

  await app.startAllMicroservices(); // ✅ Chạy Kafka Consumer

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

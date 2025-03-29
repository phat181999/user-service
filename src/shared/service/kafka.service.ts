import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";


@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject('USER_SERVICE') private readonly kafkaClient: ClientKafka
    ) {}

    async onModuleInit() {
        await this.kafkaClient.connect();
        console.log('✅ Kafka connected in User-Service');
    }
    


    

    async onModuleDestroy() {
        await this.kafkaClient.close();
    }
}

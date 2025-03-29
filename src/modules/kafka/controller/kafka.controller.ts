import { Controller, HttpException, HttpStatus, Inject, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaProducerService } from "../service/kafka.service";
import { VerifyUserMessage } from "../dto/verify-user.dto";

@Controller()
export class KafkaController  {
    constructor(
        private kafkaService: KafkaProducerService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
    ) {}


    @EventPattern('check-user')
    async handleVerifyUser(@Payload() message: { value: string | VerifyUserMessage, offset?: string, partition?: number, topic?: string }) {
    console.log(`📥 Received Kafka message:`, message);

    if (!message || !message.value) {
        console.log(`⚠️ No valid message received. Skipping processing.`);
        return;
    }

    let data: VerifyUserMessage | null = null;

    try {
        data = typeof message.value === 'string' ? JSON.parse(message.value) : message.value;

        if (!data) {
            throw new HttpException('Invalid message format', HttpStatus.BAD_REQUEST);
        }

        console.log(`📥 Parsed Kafka message:`, data);
        // ✅ Xử lý message
        await this.kafkaService.handleVerifyUser({ receiver: data.receiver });
        // ✅ Sau khi xử lý thành công, commit offset
        await this.kafkaClient.commitOffsets([
            { topic: message.topic || 'check-user', partition: message.partition || 0, offset: (parseInt(message.offset || '0') + 1).toString() }
        ]);
    } catch (error) {
        console.error(`❌ Error processing Kafka message:`, error.message);
    }
}


}
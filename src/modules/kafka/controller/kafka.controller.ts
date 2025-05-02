import { Controller, HttpException, HttpStatus, Inject, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaProducerService } from "../service/kafka.service";
import { VerifyUserMessage } from "../dto/verify-user.dto";
import { UserService } from "src/modules/user/service/user.service";
import { Cache } from 'cache-manager';

@Controller()
export class KafkaController  {
    private logger: Logger;
    constructor(
        private kafkaService: KafkaProducerService,
        private readonly userService: UserService,
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) {
        this.logger = new Logger(KafkaController.name);
    }


    // @EventPattern('check-user')
    // async handleVerifyUser(@Payload() message: { value: string | VerifyUserMessage, offset?: string, partition?: number, topic?: string }) {
    //     console.log(`📥 Received Kafka message:`, message);

    //     if (!message) {
    //         this.logger.error(`⚠️ No valid message received. Skipping processing.`);
    //         return;
    //     }

    //     let data: VerifyUserMessage | null = null;

    //     try {
    //         data = typeof message === 'string' ? JSON.parse(message) : message;

    //         if (!data) {
    //             throw new HttpException('Invalid message format', HttpStatus.BAD_REQUEST);
    //         }

    //         console.log(`📥 Parsed Kafka message:`, data);
    //         // ✅ Xử lý message
    //         await this.kafkaService.handleVerifyUser({ receiver: data.receiver });
    //         // ✅ Sau khi xử lý thành công, commit offset
    //         await this.kafkaClient.commitOffsets([
    //             { topic: message.topic || 'check-user', partition: message.partition || 0, offset: (parseInt(message.offset || '0') + 1).toString() }
    //         ]);
    //     } catch (error) {
    //         this.logger.error(`❌ Error processing Kafka message:`, error.message);
    //         return
    //     }
    // }

    @EventPattern('check-user')
    async handleVerifyUser(@Payload() message: { value: string | VerifyUserMessage }) {
      try {
        console.log(`📥 Received Kafka message:`, message);
        const data = typeof message === 'string' ? 
          JSON.parse(message) : 
          message;
  
        if (!data?.receiver) {
          throw new Error('Invalid message format');
        }
  
        // Check user in database
        const userExists = await this.userService.getUserById(data.receiver);
        
        // Send verification response
        await this.kafkaClient.emit('user-verified', {
          receiver: data.receiver,
          exists: !!userExists,
          correlationId: data.correlationId
        });
  
      } catch (error) {
        this.logger.error(`Error processing user verification: ${error.message}`);
      }
    }
}
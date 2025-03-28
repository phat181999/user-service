import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Consumer, Producer } from "kafkajs";
import { UserService } from "./user.service";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private consumer: Consumer;
  private producer: Producer;

  constructor(private readonly userService: UserService) {
    const kafka = new Kafka({
      clientId: "chat-app",
      brokers: ["localhost:9092"], // Replace with your Kafka broker
    });

    this.consumer = kafka.consumer({ groupId: "user-group" });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.producer.connect();
    await this.consumeMessages();
  }

  async onModuleDestroy() {
    await this.disconnectConsumer();
    await this.disconnectProducer();
  }

  /**
   * Consumes messages from Kafka topic.
   */
  private async consumeMessages() {
    await this.consumer.subscribe({ topic: "check-user-exists", fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        await this.processMessage(message.value.toString());
      },
    });
  }

  /**
   * Processes incoming Kafka messages.
   */
  private async processMessage(value: string) {
    try {
      if (!value) {
        this.logger.error("❌ Invalid message payload:", value);
        throw new Error("Invalid message payload");
      }

      // Parse JSON from message value
      const parsedMessage = JSON.parse(value);
      const userId = parsedMessage.userId; // Get userId from JSON

      if (!userId) {
        this.logger.error("❌ userId is missing in message:", value);
        throw new Error("Invalid message structure: userId is required");
      }

      this.logger.log(`🔍 Checking user existence: userId=${userId}`);

      const userExists = await this.userService.getUserById(userId);

      const result = {
        userId,
        userExists: !!userExists,
      };

      this.logger.log(`📩 Sending response:`, result);

      await this.sendResponse("user-exists-response", result);
    } catch (error) {
      this.logger.error("❌ Error processing message:", error);
    }
  }

  /**
   * Sends a message to a Kafka topic.
   */
  private async sendResponse(topic: string, data: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }

  /**
   * Disconnects the consumer.
   */
  private async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  /**
   * Disconnects the producer.
   */
  private async disconnectProducer() {
    await this.producer.disconnect();
  }
}

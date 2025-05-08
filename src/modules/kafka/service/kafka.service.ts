import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { VerifyUserMessage } from '../dto/verify-user.dto';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class KafkaProducerService {
  constructor(
    private readonly userService: UserService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async handleVerifyUser(user: VerifyUserMessage): Promise<void> {
    try {
      const userExists = await this.userService.getUserById(user.receiver);
      if (!userExists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const checkedUser = (await userExists) ? true : false;
      this.kafkaClient.emit('verify-user', checkedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendMessages(topic, data) {
    try {
      await this.kafkaClient.emit(topic, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

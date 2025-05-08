import { Controller } from '@nestjs/common';
import { TcpService } from '../service/tcp.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TcpController {
  constructor(private readonly tcpService: TcpService) {}

  @MessagePattern('check-user')
  async checkUser(receiver: string): Promise<boolean> {
    if (!receiver) return false;

    const checkUser = await this.tcpService.checkUser(receiver);
    return !!checkUser;
  }
}

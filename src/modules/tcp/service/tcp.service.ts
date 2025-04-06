import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserService } from "src/modules/user/service/user.service";

@Injectable()
export class TcpService {
    constructor(
      private userService: UserService
    ){}

    async checkUser(receiver: string): Promise<boolean | HttpException> {
      if (!receiver) return false;

      const checkUser = await this.userService.getUserById(receiver);
      return !!checkUser;
    }
}
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { VerifyUserMessage } from "../dto/verify-user.dto";
import { UserService } from "src/modules/user/service/user.service";


@Injectable()
export class KafkaProducerService {
    constructor(
        private readonly userService: UserService
    ) {}
    
    async handleVerifyUser(user: VerifyUserMessage): Promise<boolean | null> {
        try{
            const userExists = await this.userService.getUserById(user.receiver);
            console.log(`User exists: ${userExists}`);
            return userExists ? true : false;
        }catch(error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}         
import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { UserRepository } from "../user/repository/user.repository";
import { HashPassword } from "src/utils/hashPassword";
import { UsersModule } from "../user/user.module";


@Module({
    imports: [forwardRef(() => UsersModule)],
    controllers: [AuthController],
    providers: [AuthService, HashPassword], 
    exports: [AuthService],
})

export class AuthModule {}
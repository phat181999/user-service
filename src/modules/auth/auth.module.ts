import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { HashPassword } from "src/utils/hashPassword";
import { UsersModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";


@Module({
    imports: [
        forwardRef(() => UsersModule), 
        JwtModule.register({
            global: true,
            secret: "userService",
            signOptions: { expiresIn: '60s' },
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService, HashPassword], 
    exports: [AuthService],
})

export class AuthModule {}
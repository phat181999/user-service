import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GetUserLogin, LoginUserDto } from "../dto/loginUser.dto";
import { AuthService } from "../service/auth.service";

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
    private logger: Logger;
    constructor(
        private readonly AuthService: AuthService,
    ) {
        this.logger = new Logger(AuthController.name);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<GetUserLogin> {
        try {
                this.logger.log(`Logging in User`);
                const user = await this.AuthService.login(loginUserDto);
                this.logger.log(`Logged in User`);
                return user;
            } catch (error) {
                this.logger.error(`Error logging in user: ${error.message}`);
                throw new Error(`Error logging in user: ${error.message}`);
        }
    }
}
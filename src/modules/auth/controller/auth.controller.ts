import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GetUserLogin, LoginUserDto } from "../dto/loginUser.dto";
import { AuthService } from "../service/auth.service";
import { AuthGuard } from "@nestjs/passport";

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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
      // redirects to Google
    }
  
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async handleGoogleCallback(@Req() req, @Res() res) {
      try {
        const user = req.user;
        const userProcess = await this.AuthService.loginWithGoogle(user);
        return res.status(HttpStatus.OK).json({
            message: 'User logged in successfully',
            user: userProcess,
        });
      }catch (error) {
        this.logger.error(`Error logging in user: ${error.message}`);
        throw new BadRequestException(`Error logging in user: ${error.message}`);
      }
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubLogin(): Promise<void> {
      // Redirects to GitHub
    }
  
    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubCallback(@Req() req, @Res() res) {
      try {
        const user = req.user;
        console.log(req.user)
        const userProcess = await this.AuthService.loginWithGithub(user);
        return res.status(HttpStatus.OK).json({
            message: 'User logged in successfully',
            user: userProcess,
        });
      }catch (error) {
        this.logger.error(`Error logging in user: ${error.message}`);
        throw new BadRequestException(`Error logging in user: ${error.message}`);
      }
    }
}
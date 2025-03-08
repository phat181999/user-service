import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param, Logger, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/createUser.dto';
import { GetUser } from '../dto/getUser.dto';


@Controller('users')
export class UserController {
  private logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      this.logger.log(`Creating User`);
      const user = await this.userService.createUser(createUserDto);
      this.logger.log(`Created User`);
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      return error;
    }
  }

  @Get('all')
  async getUsers(): Promise<GetUser[]> {
    try{
      this.logger.log(`Getting all users`);
      const users = await this.userService.getUsers();
      this.logger.log(`Got all users`);
      return users;
    }catch(error){
      this.logger.error(`Error getting all users: ${error.message}`);
      return error;
    }
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
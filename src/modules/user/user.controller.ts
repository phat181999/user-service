import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Get('all')
  async getUsers() {
    return this.userService.getUsers();
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
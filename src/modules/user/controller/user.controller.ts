import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param, Logger, Res, Put, Delete } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/createUser.dto';
import { GetUser } from '../dto/getUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUserLogin } from '../../auth/dto/loginUser.dto';

@ApiTags('users')
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
      throw new Error(`Error creating user: ${error.message}`);
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
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<GetUser | null> {
    try{
      this.logger.log(`Getting user by id`);
      const user = await this.userService.getUserById(userId);
      this.logger.log(`Got user by id`);
      return user;
    }catch(error){
      this.logger.error(`Error getting user by id: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  @Get('email/:email') 
  async getUserByEmail(@Param('email') email: string): Promise<GetUser | null> {
    try{
      this.logger.log(`Getting user by email`);
      const user = await this.userService.getUserByEmail(email);
      this.logger.log(`Got user by email`);
      return user;
    }catch(error) {
      this.logger.error(`Error getting user by email: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') userId: string, @Body() createUserDto: Partial<CreateUserDTO>): Promise<CreateUserDTO> {
    try{
      this.logger.log(`Updating user`);
      const user = await this.userService.updateUser(userId, createUserDto);
      this.logger.log(`Updated user`);
      return user;
    }catch(error){
      this.logger.error(`Error updating user: ${error.message}`);
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    try{
      this.logger.log(`Deleting user`);
      const user = await this.userService.deleteUser(userId);
      this.logger.log(`Deleted user`);
      return user;
    }catch(error){
      this.logger.error(`Error deleting user: ${error.message}`);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
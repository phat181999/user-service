import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { IsUnique } from 'src/common/validators/isUniqueConstraint';
import { HashPassword } from 'src/utils/hashPassword';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository, IsUnique, HashPassword], 
  exports: [UserService, IsUnique], 
})
export class UsersModule {}

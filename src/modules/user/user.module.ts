import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

import { UserRepository } from './repository/user.repository';
import { IsUnique } from 'src/common/validators/isUniqueConstraint';
import { HashPassword } from 'src/utils/hashPassword';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository, IsUnique, HashPassword], 
  exports: [UserService, IsUnique], 
})
export class UsersModule {}

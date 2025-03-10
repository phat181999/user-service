import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

import { UserRepository } from './repository/user.repository';
import { IsUnique } from 'src/common/validators/isUniqueConstraint';
import { HashPassword } from 'src/utils/hashPassword';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AccessControlService } from 'src/shared/service/accessControl.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService, 
    UserRepository, 
    IsUnique, 
    HashPassword,
    AuthGuard,
    RoleGuard,
    AccessControlService
  ], 
  exports: [UserService, UserRepository], 
})
export class UsersModule {}

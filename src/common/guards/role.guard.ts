import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../shared/interface/index';
import { ROLE_KEY } from '../decorators/role.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!requiredRoles) {
      return true;
    }

    const user = request.user;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('User does not have the required role');
    }

    return true;
  }
}

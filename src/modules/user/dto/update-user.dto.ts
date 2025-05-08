import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUnique } from 'src/common/validators/isUniqueConstraint';
import { UserRole } from 'src/shared/interface';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The username of the user',
    maxLength: 100,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({
    description: 'The email of the user',
    uniqueItems: true,
  })
  @IsString()
  @Validate(IsUnique, ['users', 'email'])
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'The image name of the user',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.USER;
}

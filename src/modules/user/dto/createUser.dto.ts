import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUnique } from '../../../common/validators/isUniqueConstraint';
import { UserRole } from '../../../shared/interface/index';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The username of the user',
    minLength: 4,
    maxLength: 100,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  userName: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The email of the user',
    uniqueItems: true,
  })
  @IsString()
  @Validate(IsUnique, ['users', 'email'])
  email: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.USER;

  @ApiPropertyOptional({
    description: 'The image name of the user',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    description: 'The date when the user was created',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date when the user was deleted',
    type: Date,
  })
  deletedAt: Date;
}

export class createUserWithGoogleDto {
  @ApiProperty({
    description: 'The username of the user',
    maxLength: 100,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  userName: string;

  @ApiProperty({
    description: 'The email of the user',
    uniqueItems: true,
  })
  @IsString()
  @Validate(IsUnique, ['users', 'email'])
  email: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  image: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.USER;
}

export class createUserWithGithubDto {
  @ApiProperty({
    description: 'The username of the user',
    maxLength: 100,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  userName: string;

  @ApiProperty({
    description: 'The email of the user',
    uniqueItems: true,
  })
  @IsString()
  @Validate(IsUnique, ['users', 'email'])
  email: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  image: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
  })
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.USER;
}

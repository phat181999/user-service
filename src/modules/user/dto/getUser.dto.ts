import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';

export class GetUserDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  userId: string;

  @ApiProperty({ description: 'The name of the user' })
  userName: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @ApiProperty({ description: 'The role of the user' })
  role: string;

  @ApiProperty({ description: 'The date the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date the user was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The date the user was deleted', nullable: true })
  deletedAt: Date | null;
}

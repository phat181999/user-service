import { IsString, MaxLength, MinLength, Validate } from "class-validator";
import { IsUnique } from "src/common/validators/isUniqueConstraint";

export class CreateUserDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    userName: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @Validate(IsUnique, ['users', 'email'])
    email: string;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

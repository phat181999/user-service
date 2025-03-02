import { IsString, MaxLength, MinLength, Validate } from "class-validator";
import { UserEntity } from "./user.entity";
import { IsUnique } from "src/common/validators/isUniqueConstraint";

export class CreateUserDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    @Validate(IsUnique, ['users', 'userName'])
    userName: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    // @IsUnique(UserEntity, "email", { message: "Email must be unique" })
    email: string;
}

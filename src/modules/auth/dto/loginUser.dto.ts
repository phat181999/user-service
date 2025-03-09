import { IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    password: string;
    @IsString()
    email: string;
}

export class GetUserLogin {
    email: string;
    userName: string;
    role: string;
    createdAt: Date;
}
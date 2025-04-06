import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;
}

export class GetUserLogin {
    access_token: string;
    refreshToken: string;
    refresh_expires_in: number;
    expires_in: number;
}
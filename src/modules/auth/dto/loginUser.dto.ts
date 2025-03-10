import { IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    password: string;
    @IsString()
    email: string;
}

export class GetUserLogin {
    access_token: string;
    refreshToken: string;
    refresh_expires_in: number;
    expires_in: number;
    // role: string;
}
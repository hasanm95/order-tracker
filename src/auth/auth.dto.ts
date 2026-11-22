import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";


export class SignUpDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";


@Controller({
    path: "auth",
    version: '1'
})
export class AuthController {
    @Post("signup")
    async signUp(@Body() dto: SignUpDto) {
        console.log(dto)
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        console.log("login =====> ",dto)
    }
}
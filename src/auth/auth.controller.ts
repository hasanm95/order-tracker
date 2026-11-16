import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";


@Controller({
    path: "auth",
    version: '1'
})
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("signup")
    async signUp(@Body() dto: SignUpDto) {
       return this.authService.signUp(dto)
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        console.log("login =====> ",dto)
    }
}
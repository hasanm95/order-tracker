import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";
import { CredentialsService } from "./credentials.service.js";
import { Public, TokenService } from "@nestjs/authentication";


@Controller({
    path: "auth",
    version: '1'
})
export class AuthController {

    constructor(
        private readonly credentialsService: CredentialsService,
        private readonly tokenService: TokenService
    ) {}

    @Public()
    @Post("signup")
    async signUp(@Body() dto: SignUpDto) {
       const user = await this.credentialsService.register(dto.email, dto.password)
       return this.tokenService.issue(user.id, {method: "password"})
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        console.log("login =====> ",dto)
    }
}
import { Body, Controller, Get, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";
import { CredentialsService } from "./credentials.service.js";
import { CurrentUser, Public, TokenService } from "@nestjs/authentication";
import type { User } from "../users/user.js";


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

    @Public()
    @Post("login")
    @HttpCode(200)
    async login(@Body() dto: LoginDto) {
        const user = await this.credentialsService.verify(dto.email, dto.password)
        if (!user) {
            throw new UnauthorizedException("Invalid email or password")
        }

        return this.tokenService.issue(user.id, { method: "password" })
    }

    @Public()
    @Post("refresh")
    @HttpCode(200)
    refresh(@Body('refreshToken') refreshToken: string){
        return this.tokenService.refresh(refreshToken)
    }

    @Get("me")
    me(@CurrentUser() user: User) {
        return user
    }
}
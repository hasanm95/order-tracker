import { Body, Controller, Get, HttpCode, Inject, Post, UnauthorizedException } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";
import { CredentialsService } from "./credentials.service.js";
import { CurrentUser, type JwtClaims, Public, TokenService } from "@nestjs/authentication";
import type { User } from "../users/user.js";
import { REDIS_CLIENT } from "../redis/redis.module.js";
import {Redis} from "ioredis";


@Controller({
    path: "auth",
    version: '1'
})
export class AuthController {

    constructor(
        private readonly credentialsService: CredentialsService,
        private readonly tokenService: TokenService,
        @Inject(REDIS_CLIENT) private readonly redis: Redis
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

    @Post("logout")
    @HttpCode(200)
    async logout(@CurrentUser() claims: JwtClaims) {
        if (claims.jti) {
            await this.redis.set(`bl:${claims.jti}`, '1', 'EX', 900);
        }
        
        return { message: 'Logged out successfully' };
    }

    @Get("me")
    me(@CurrentUser() user: User) {
        return user
    }
}
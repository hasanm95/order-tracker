import { Body, Controller, Get, Headers, HttpCode, Inject, Post, UnauthorizedException } from "@nestjs/common";
import { LoginDto, SignUpDto } from "./auth.dto.js";
import { CredentialsService } from "./credentials.service.js";
import { CurrentUser, Public, TokenService } from "@nestjs/authentication";
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

    @Public()
    @Post("logout")
    @HttpCode(200)
    async logout(
        @Headers('authorization') authHeader: string | undefined, 
        @Body('refreshToken') refreshToken: string)
    {
        if (refreshToken) {
            await this.tokenService.revoke(refreshToken);
        }
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payloadPart = token.split('.')[1];
            if (payloadPart) {
                try {
                    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString());
                    if (payload.jti) {
                        await this.redis.set(`bl:${payload.jti}`, '1', 'EX', 900);
                    }
                } catch {}
            }
        }
        
        return { message: 'Logged out successfully' };
    }

    @Post('logout-all')
    @HttpCode(200)
    async logoutAll(@CurrentUser() user: User) {
        await this.tokenService.revokeAll(user.id)
        return { message: 'Logged out from all devices' };
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
import { AuthenticationRegistry, JwtBearerProvider, JwtClaims } from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";
import type { User } from "../users/user.js";
import { UsersRepository } from "../users/users.repository.js";
import {Redis} from "ioredis";
import { REDIS_CLIENT } from "../redis/redis.module.js";


@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
    constructor(
        private readonly usersRepository: UsersRepository,
        registry: AuthenticationRegistry,
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) {
        super({realm: "api"})
        registry.registerProvider(this)
    }

    async validate(claims: JwtClaims) {
        if (claims.jti) {
            const isBlacklisted = await this.redis.get(`bl:${claims.jti}`);
            if (isBlacklisted) {
                return null; 
            }
        }
        return claims.sub ? this.usersRepository.findById(claims.sub) : null
    }
}
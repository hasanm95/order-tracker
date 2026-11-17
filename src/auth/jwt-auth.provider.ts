import { AuthenticationRegistry, JwtBearerProvider, JwtClaims } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import type { User } from "../users/user.js";
import { UsersRepository } from "../users/users.repository.js";


@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
    constructor(
        private readonly usersRepository: UsersRepository,
        registry: AuthenticationRegistry
    ) {
        super({realm: "api"})
        registry.registerProvider(this)
    }

    validate({sub}: JwtClaims): User | Promise<User | null | undefined> | null | undefined {
        return sub ? this.usersRepository.findById(sub) : null
    }
}
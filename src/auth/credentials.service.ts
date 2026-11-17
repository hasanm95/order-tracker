import { ConflictException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../users/users.repository.js";
import { PasswordHasher } from "@nestjs/authentication";
import type { User } from "../users/user.js";


@Injectable()
export class CredentialsService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly passwordHasher: PasswordHasher
    ){}

    async register(email: string, password: string): Promise<User> {
        if (await this.usersRepository.findByEmail(email)) {
            throw new ConflictException('Email already registered');
        }
        const hash = await this.passwordHasher.hash(password);
        return this.usersRepository.create(email, hash);
    }

    async verify(email: string, password: string): Promise<User | null> {
        const found = await this.usersRepository.findCredentials(email)
        const valid = await this.passwordHasher.verify(password, found?.passwordHash)

        if (!valid || !found) {
            return null;
        }
        return found.user;
    }
}
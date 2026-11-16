import { Injectable } from "@nestjs/common";
import { User } from "./user.entity.js";


@Injectable()
export class UsersService {
    // Temporary in-memory database
    private users: User[] = [];

    async create(data: {email: string; password: string}): Promise<User> {
        const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            password: data.password,
        }

        this.users.push(newUser)
        return newUser
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(u => u.email === email)
    }
}
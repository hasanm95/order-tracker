import { Injectable } from "@nestjs/common";
import { User } from "./user.js";
import { randomUUID } from "node:crypto";

interface UserRow extends User {
    passwordHash: string
}

@Injectable()
export class UsersRepository {
    private readonly rows = new Map<string, UserRow>();

    async create(email: string, passwordHash: string): Promise<User> {
        const normalized = email.trim().toLowerCase();
        const row: UserRow = { id: randomUUID(), email: normalized, passwordHash };
        this.rows.set(row.id, row);
        return { id: row.id, email: row.email };
    }

    async findByEmail(email: string): Promise<User | null> {
        const normalized = email.trim().toLowerCase();
        const row = [...this.rows.values()].find((r) => r.email === normalized);
        return row ? { id: row.id, email: row.email } : null;
    }
}
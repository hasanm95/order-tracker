import { Injectable } from "@nestjs/common";
import { User } from "./user.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../db/schema.js";

interface UserRow extends User {
    passwordHash: string
}

@Injectable()
export class UsersRepository {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    private readonly rows = new Map<string, UserRow>();

    async create(email: string, passwordHash: string): Promise<User> {
        const normalized = email.trim().toLowerCase();
        const [row] = await this.db.insert(users).values({ email: normalized, passwordHash }).returning({ id: users.id, email: users.email });
        console.log("====> row", row)
        return row;
    }

    async findByEmail(email: string): Promise<User | null> {
        const normalized = email.trim().toLowerCase();
        const row = [...this.rows.values()].find((r) => r.email === normalized);
        return row ? { id: row.id, email: row.email } : null;
    }


    async findById(id: string): Promise<User | null> {
        const row = this.rows.get(id);
        return row ? { id: row.id, email: row.email } : null;
    }

    async findCredentials(email: string): Promise<{ user: User; passwordHash: string } | null> {
        const normalized = email.trim().toLowerCase();
        const row = [...this.rows.values()].find((r) => r.email === normalized);
        return row ? { user: { id: row.id, email: row.email }, passwordHash: row.passwordHash } : null;
    }
}
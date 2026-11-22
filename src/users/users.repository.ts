import { Injectable } from "@nestjs/common";
import { User } from "./user.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersRepository {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async create(email: string, passwordHash: string): Promise<User> {
        const normalized = email.trim().toLowerCase();
        const [row] = await this.db
            .insert(users)
            .values({ email: normalized, passwordHash })
            .returning({ id: users.id, email: users.email });
        return row;
    }

    async findByEmail(email: string): Promise<User | null> {
        const normalized = email.trim().toLowerCase();
        const [row] = await this.db
            .select({id: users.id, email: users.email})
            .from(users)
            .where(eq(users.email, normalized))
        return row ?? null
    }


    async findById(id: string): Promise<User | null> {
        const [row] = await this.db
            .select({ id: users.id, email: users.email })
            .from(users)
            .where(eq(users.id, id));
        return row ?? null;
    }

    async findCredentials(email: string): Promise<{ user: User; passwordHash: string } | null> {
        const normalized = email.trim().toLowerCase();
        const [row] = await this.db
            .select()
            .from(users)
            .where(eq(users.email, normalized));
        return row ? { user: { id: row.id, email: row.email }, passwordHash: row.passwordHash } : null;
    }
}
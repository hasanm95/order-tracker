import { RefreshTokenRecord } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { refreshTokens } from "../db/schema.js";
import { and, eq, isNull, lte } from "drizzle-orm";


@Injectable()
export class DrizzleRefreshTokenStore {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
        const [row] = await this.db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.id, id))
        
        if (!row) return undefined

        const { revoked: _, ...token } = row;
        return withoutNulls(token);
    }

    async saveRefreshToken(record: RefreshTokenRecord): Promise<void>  {
        await this.db.insert(refreshTokens).values(record);
        await this.db.delete(refreshTokens).where(lte(refreshTokens.familyExpiresAt, record.createdAt));
    }

    async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
        const updated = await this.db
            .update(refreshTokens)
            .set({ usedAt: at })
            .where(and(eq(refreshTokens.id, id), isNull(refreshTokens.usedAt)))
            .returning({ id: refreshTokens.id });
        return updated.length === 1;
    }

    async revokeRefreshTokenFamily(familyId: string): Promise<void> {
        await this.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.familyId, familyId));
    }

    async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
        const revoked = await this.db
            .select({ id: refreshTokens.id })
            .from(refreshTokens)
            .where(and(eq(refreshTokens.familyId, familyId), eq(refreshTokens.revoked, true)))
            .limit(1);
        return revoked.length > 0;
    }

    async revokeUserRefreshTokens(userId: string): Promise<void> {
        await this.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.userId, userId));
    }

}

function withoutNulls(token: { id: string; familyId: string; userId: string; createdAt: Date; expiresAt: Date; familyExpiresAt: Date; usedAt: Date | null; claims: Record<string, unknown> | null; }): RefreshTokenRecord | PromiseLike<RefreshTokenRecord | undefined> | undefined {
    throw new Error("Function not implemented.");
}

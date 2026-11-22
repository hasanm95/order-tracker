import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})

export const refreshTokens = pgTable("refresh_tokens", {
    id: text('id').primaryKey(),
    familyId: text('family_id').notNull(),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    familyExpiresAt: timestamp('family_expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    revoked: boolean('revoked').default(false).notNull(),
    claims: jsonb('claims').$type<Record<string, unknown>>(),
})

export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    trackingCode: text("tracking_code").unique().notNull(),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone").notNull(),
    address: text("address").notNull(),
    items: text("items").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})

export const statusEnum = pgEnum("status", ["Placed", "Packed", "On the way", "Delivered", "Cancelled"])

export const statusHistory = pgTable("status_history", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    status: statusEnum("status").default("Placed"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    changedBy: text("changed_by").notNull()
})

export type User = typeof users.$inferInsert
export type Order = Omit<typeof orders.$inferInsert, "id" | "createdAt">
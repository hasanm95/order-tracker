import { Injectable } from "@nestjs/common";
import { orders, OrderStatus, statusHistory } from "../db/schema.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { desc, eq } from "drizzle-orm";
import { CreateOrder } from "./orders.types.js";

@Injectable()
export class OrdersRepository {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async create(data: CreateOrder) {
        return await this.db.transaction(async (tx) => {
            // Insert new order
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    trackingCode: data.trackingCode, 
                    customerName: data.customerName, 
                    customerPhone: data.customerPhone, 
                    items: data.items, 
                    address: data.address, 
                    amount: data.amount
                })
                .returning()
            
            // Insert initial 'Placed' status history record
            await tx.insert(statusHistory).values({
                orderId: newOrder.id,
                changedBy: data.createdBy,
            })

            return newOrder
        })
    }

    async updateOrderStatus(orderId: string, status: OrderStatus, changedBy: string){
        const [historyEntry] = await this.db.insert(statusHistory)
            .values({
                orderId, 
                status, 
                changedBy
            })
            .returning()

        return historyEntry;
    }

    async getOrderStatus(orderId: string) {
        const [result] = await this.db
            .select({
                id: orders.id,
                status: statusHistory.status
            })
            .from(orders)
            .leftJoin(statusHistory, eq(statusHistory.orderId, orders.id))
            .where(eq(orders.id, orderId))
            .orderBy(desc(statusHistory.createdAt))
            .limit(1)

        return result;
    }
}